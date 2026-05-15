const Contest = require('../models/contest');
const ContestSubmission = require('../models/contestSubmission');
const UserRating = require('../models/userRating');
const Problem = require('../models/problem');
const User = require('../models/user');
const { getLanguageById, submitBatch, submitToken } = require('../utils/problemUtility');
const { calculateNewRatings, getRatingTitle, getRatingColor } = require('../utils/ratingEngine');
const redisClient = require('../config/redis');

const autoUpdateStatus = async (contest) => {
    const now = new Date();
    let newStatus = contest.status;
    if (now >= contest.endTime && contest.status !== 'ended') {
        newStatus = 'ended';
    } else if (now >= contest.startTime && now < contest.endTime && contest.status !== 'live') {
        newStatus = 'live';
    }
    if (newStatus !== contest.status) {
        contest.status = newStatus;
        await contest.save();
    }
    return contest;
};

const createContest = async (req, res) => {
    try {
        const { title, description, startTime, endTime, duration, problems, isRated, maxParticipants, rules, penaltyTime } = req.body;

        if (!title || !description || !startTime || !endTime || !duration || !problems || problems.length === 0) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const problemIds = problems.map(p => p.problemId);
        const existingProblems = await Problem.find({ _id: { $in: problemIds } });
        if (existingProblems.length !== problemIds.length) {
            return res.status(400).json({ message: 'One or more problem IDs are invalid' });
        }

        const now = new Date();
        const start = new Date(startTime);
        const end = new Date(endTime);
        let status = 'upcoming';
        if (now >= end) status = 'ended';
        else if (now >= start) status = 'live';

        const contest = await Contest.create({
            title, description, startTime: start, endTime: end, duration,
            problems: problems.map((p, i) => ({ problemId: p.problemId, points: p.points || 100, order: p.order || i + 1 })),
            createdBy: req.result._id,
            status, isRated: isRated !== undefined ? isRated : true,
            maxParticipants: maxParticipants || 0,
            rules: rules || '',
            penaltyTime: penaltyTime || 20
        });

        res.status(201).json({ message: 'Contest created successfully', contest });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

const updateContest = async (req, res) => {
    try {
        const { id } = req.params;
        const contest = await Contest.findById(id);
        if (!contest) return res.status(404).json({ message: 'Contest not found' });

        const updatedContest = await Contest.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, new: true });
        res.status(200).json({ message: 'Contest updated successfully', contest: updatedContest });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

const deleteContest = async (req, res) => {
    try {
        const { id } = req.params;
        const contest = await Contest.findByIdAndDelete(id);
        if (!contest) return res.status(404).json({ message: 'Contest not found' });

        await ContestSubmission.deleteMany({ contestId: id });
        res.status(200).json({ message: 'Contest deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

const getAllContests = async (req, res) => {
    try {
        const contests = await Contest.find({})
            .populate('createdBy', 'firstName lastName')
            .sort({ startTime: -1 })
            .lean();

        const now = new Date();
        const updated = contests.map(c => {
            if (now >= c.endTime && c.status !== 'ended') c.status = 'ended';
            else if (now >= c.startTime && now < c.endTime && c.status !== 'live') c.status = 'live';
            return { ...c, participantCount: c.participants ? c.participants.length : 0 };
        });

        const bulkOps = updated.filter((c, i) => c.status !== contests[i].status)
            .map(c => ({ updateOne: { filter: { _id: c._id }, update: { status: c.status } } }));
        if (bulkOps.length > 0) await Contest.bulkWrite(bulkOps);

        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

const getContestById = async (req, res) => {
    try {
        const { id } = req.params;
        let contest = await Contest.findById(id)
            .populate('createdBy', 'firstName lastName')
            .populate('problems.problemId', '_id title difficulty tags');

        if (!contest) return res.status(404).json({ message: 'Contest not found' });
        contest = await autoUpdateStatus(contest);

        const userId = req.result?._id;
        const isRegistered = userId
            ? contest.participants.some(p => p.userId.toString() === userId.toString())
            : false;

        const contestObj = contest.toObject();
        contestObj.isRegistered = isRegistered;
        contestObj.participantCount = contest.participants.length;

        if (contest.status === 'upcoming') {
            contestObj.problems = contestObj.problems.map(p => ({
                points: p.points,
                order: p.order,
                problemId: { _id: p.problemId._id, title: '???', difficulty: p.problemId.difficulty }
            }));
        }

        res.status(200).json(contestObj);
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

const registerForContest = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.result._id;

        const contest = await Contest.findById(id);
        if (!contest) return res.status(404).json({ message: 'Contest not found' });

        await autoUpdateStatus(contest);
        if (contest.status === 'ended') {
            return res.status(400).json({ message: 'Contest has already ended' });
        }

        const alreadyRegistered = contest.participants.some(p => p.userId.toString() === userId.toString());
        if (alreadyRegistered) {
            return res.status(400).json({ message: 'Already registered for this contest' });
        }

        if (contest.maxParticipants > 0 && contest.participants.length >= contest.maxParticipants) {
            return res.status(400).json({ message: 'Contest is full' });
        }

        contest.participants.push({ userId, joinedAt: new Date() });
        await contest.save();

        const existingRating = await UserRating.findOne({ userId });
        if (!existingRating) {
            await UserRating.create({ userId, rating: 1500, maxRating: 1500 });
        }

        res.status(200).json({ message: 'Registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

const submitContestCode = async (req, res) => {
    try {
        const { contestId, problemId } = req.params;
        const userId = req.result._id;
        let { code, language } = req.body;

        if (!code || !language) return res.status(400).json({ message: 'Code and language are required' });

        const contest = await Contest.findById(contestId);
        if (!contest) return res.status(404).json({ message: 'Contest not found' });

        await autoUpdateStatus(contest);
        if (contest.status !== 'live') {
            return res.status(400).json({ message: 'Contest is not live' });
        }

        const isParticipant = contest.participants.some(p => p.userId.toString() === userId.toString());
        if (!isParticipant) {
            return res.status(403).json({ message: 'You are not registered for this contest' });
        }

        const contestProblem = contest.problems.find(p => p.problemId.toString() === problemId);
        if (!contestProblem) {
            return res.status(404).json({ message: 'Problem not found in this contest' });
        }

        if (language === 'cpp') language = 'c++';

        const problem = await Problem.findById(problemId);
        if (!problem) return res.status(404).json({ message: 'Problem not found' });

        const alreadyAccepted = await ContestSubmission.findOne({
            contestId, userId, problemId, status: 'accepted'
        });
        if (alreadyAccepted) {
            return res.status(400).json({ message: 'Problem already solved', alreadySolved: true });
        }

        const submission = await ContestSubmission.create({
            contestId, userId, problemId, code, language,
            status: 'pending',
            testCasesTotal: problem.hiddenTestCases ? problem.hiddenTestCases.length : 0
        });

        let testResult = [];
        if (Array.isArray(problem.hiddenTestCases) && problem.hiddenTestCases.length > 0) {
            try {
                const languageId = getLanguageById(language);
                const submissions = problem.hiddenTestCases.map(tc => ({
                    source_code: code,
                    language_id: languageId,
                    stdin: tc.input,
                    expected_output: tc.output
                }));
                const submitResult = await submitBatch(submissions);
                const resultTokens = submitResult.map(v => v.token);
                testResult = await submitToken(resultTokens);
            } catch (error) {
                submission.status = 'error';
                submission.errorMessage = error.message;
                await submission.save();
                return res.status(503).json({ message: 'Code execution service unavailable', error: error.message });
            }
        }

        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = 'accepted';
        let errorMessage = '';

        if (Array.isArray(testResult)) {
            for (const test of testResult) {
                if (test.status_id === 3) {
                    testCasesPassed++;
                    runtime += parseFloat(test.time || 0);
                    memory = Math.max(memory, test.memory || 0);
                } else {
                    status = test.status_id === 4 ? 'error' : 'wrong';
                    errorMessage = test.stderr || '';
                }
            }
        }

        submission.status = status;
        submission.testCasesPassed = testCasesPassed;
        submission.testCasesTotal = problem.hiddenTestCases.length;
        submission.runtime = runtime;
        submission.memory = memory;
        submission.errorMessage = errorMessage;
        submission.points = status === 'accepted' ? contestProblem.points : 0;
        await submission.save();

        try {
            await redisClient.del(`leaderboard:${contestId}`);
        } catch (e) { /* ignore redis errors */ }

        const accepted = status === 'accepted';
        res.status(201).json({
            accepted,
            totalTestCases: submission.testCasesTotal,
            passedTestCases: testCasesPassed,
            runtime, memory, points: submission.points
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

const getLeaderboard = async (req, res) => {
    try {
        const { id } = req.params;

        const contest = await Contest.findById(id);
        if (!contest) return res.status(404).json({ message: 'Contest not found' });

        if (contest.status === 'live') {
            try {
                const cached = await redisClient.get(`leaderboard:${id}`);
                if (cached) return res.status(200).json(JSON.parse(cached));
            } catch (e) { /* ignore */ }
        }

        const submissions = await ContestSubmission.find({ contestId: id })
            .populate('userId', 'firstName lastName')
            .populate('problemId', '_id title')
            .lean();

        const participantMap = {};

        for (const sub of submissions) {
            if (!sub.userId) continue;
            const key = sub.userId._id.toString();

            if (!participantMap[key]) {
                participantMap[key] = {
                    userId: sub.userId._id,
                    firstName: sub.userId.firstName,
                    lastName: sub.userId.lastName,
                    totalPoints: 0,
                    totalPenalty: 0,
                    solvedCount: 0,
                    problems: {}
                };
            }

            const pid = sub.problemId._id.toString();
            if (!participantMap[key].problems[pid]) {
                participantMap[key].problems[pid] = {
                    problemId: sub.problemId._id,
                    title: sub.problemId.title,
                    attempts: 0,
                    accepted: false,
                    points: 0,
                    solvedAt: null
                };
            }

            const pInfo = participantMap[key].problems[pid];
            pInfo.attempts++;

            if (sub.status === 'accepted' && !pInfo.accepted) {
                pInfo.accepted = true;
                pInfo.points = sub.points;
                pInfo.solvedAt = sub.submittedAt || sub.createdAt;
                participantMap[key].totalPoints += sub.points;
                participantMap[key].solvedCount++;

                const timeDiffMs = new Date(pInfo.solvedAt) - new Date(contest.startTime);
                const timePenalty = Math.floor(timeDiffMs / 60000);
                const wrongPenalty = (pInfo.attempts - 1) * contest.penaltyTime;
                participantMap[key].totalPenalty += timePenalty + wrongPenalty;
            }
        }

        for (const p of contest.participants) {
            const key = p.userId.toString();
            if (!participantMap[key]) {
                const user = await User.findById(p.userId).select('firstName lastName').lean();
                if (user) {
                    participantMap[key] = {
                        userId: p.userId,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        totalPoints: 0,
                        totalPenalty: 0,
                        solvedCount: 0,
                        problems: {}
                    };
                }
            }
        }

        const leaderboard = Object.values(participantMap)
            .sort((a, b) => {
                if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
                return a.totalPenalty - b.totalPenalty;
            })
            .map((entry, index) => ({
                rank: index + 1,
                ...entry,
                problems: Object.values(entry.problems)
            }));

        if (contest.status === 'live') {
            try {
                await redisClient.setEx(`leaderboard:${id}`, 30, JSON.stringify(leaderboard));
            } catch (e) { /* ignore */ }
        }

        res.status(200).json(leaderboard);
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

const finalizeContest = async (req, res) => {
    try {
        const { id } = req.params;
        const contest = await Contest.findById(id);
        if (!contest) return res.status(404).json({ message: 'Contest not found' });

        if (contest.status !== 'ended' && contest.status !== 'live') {
            return res.status(400).json({ message: 'Contest must be ended or live to finalize' });
        }

        contest.status = 'ended';
        await contest.save();

        if (!contest.isRated) {
            return res.status(200).json({ message: 'Contest finalized (unrated)' });
        }

        const submissions = await ContestSubmission.find({ contestId: id }).lean();
        const scoreMap = {};

        for (const sub of submissions) {
            const key = sub.userId.toString();
            if (!scoreMap[key]) scoreMap[key] = { points: 0, penalty: 0, solvedCount: 0, solvedProblems: new Set() };

            if (sub.status === 'accepted' && !scoreMap[key].solvedProblems.has(sub.problemId.toString())) {
                scoreMap[key].solvedProblems.add(sub.problemId.toString());
                scoreMap[key].points += sub.points;
                scoreMap[key].solvedCount++;
            }
        }

        const participantIds = contest.participants.map(p => p.userId);
        const ratings = await UserRating.find({ userId: { $in: participantIds } }).lean();
        const ratingMap = {};
        for (const r of ratings) ratingMap[r.userId.toString()] = r;

        const ranked = participantIds.map(uid => {
            const key = uid.toString();
            const score = scoreMap[key] || { points: 0, penalty: 0 };
            const rating = ratingMap[key] || { rating: 1500, contestsPlayed: 0 };
            return { userId: uid, rating: rating.rating, contestsPlayed: rating.contestsPlayed, points: score.points, penalty: score.penalty };
        }).sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            return a.penalty - b.penalty;
        }).map((p, i) => ({ ...p, rank: i + 1 }));

        const newRatings = calculateNewRatings(ranked);

        for (const nr of newRatings) {
            await UserRating.findOneAndUpdate(
                { userId: nr.userId },
                {
                    $set: { rating: nr.newRating, maxRating: Math.max(nr.newRating, ratingMap[nr.userId.toString()]?.maxRating || 1500) },
                    $inc: { contestsPlayed: 1 },
                    $push: {
                        ratingHistory: {
                            contestId: id,
                            contestTitle: contest.title,
                            oldRating: nr.oldRating,
                            newRating: nr.newRating,
                            rank: nr.rank,
                            delta: nr.delta,
                            date: new Date()
                        }
                    }
                },
                { upsert: true, new: true }
            );
        }

        res.status(200).json({ message: 'Contest finalized and ratings updated', ratings: newRatings });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

const getUserRating = async (req, res) => {
    try {
        const userId = req.params.userId || req.result._id;
        let rating = await UserRating.findOne({ userId }).lean();

        if (!rating) {
            rating = { userId, rating: 1500, maxRating: 1500, contestsPlayed: 0, ratingHistory: [] };
        }

        rating.title = getRatingTitle(rating.rating);
        rating.color = getRatingColor(rating.rating);

        res.status(200).json(rating);
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

const getGlobalLeaderboard = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const total = await UserRating.countDocuments({});
        const ratings = await UserRating.find({})
            .sort({ rating: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'firstName lastName')
            .lean();

        const leaderboard = ratings.map((r, i) => ({
            rank: skip + i + 1,
            userId: r.userId?._id,
            firstName: r.userId?.firstName,
            lastName: r.userId?.lastName,
            rating: r.rating,
            maxRating: r.maxRating,
            contestsPlayed: r.contestsPlayed,
            title: getRatingTitle(r.rating),
            color: getRatingColor(r.rating)
        }));

        res.status(200).json({ leaderboard, total, page, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

const getMyContestSubmissions = async (req, res) => {
    try {
        const { contestId } = req.params;
        const userId = req.result._id;

        const submissions = await ContestSubmission.find({ contestId, userId })
            .populate('problemId', '_id title')
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json(submissions);
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

module.exports = {
    createContest, updateContest, deleteContest,
    getAllContests, getContestById, registerForContest,
    submitContestCode, getLeaderboard, finalizeContest,
    getUserRating, getGlobalLeaderboard, getMyContestSubmissions
};
