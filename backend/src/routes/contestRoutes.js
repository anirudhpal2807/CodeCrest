const express = require('express');
const contestRouter = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const userMiddleware = require('../middleware/userMiddleware');
const {
    createContest, updateContest, deleteContest,
    getAllContests, getContestById, registerForContest,
    submitContestCode, getLeaderboard, finalizeContest,
    getUserRating, getGlobalLeaderboard, getMyContestSubmissions
} = require('../controllers/contestController');

contestRouter.post('/create', adminMiddleware, createContest);
contestRouter.put('/update/:id', adminMiddleware, updateContest);
contestRouter.delete('/delete/:id', adminMiddleware, deleteContest);
contestRouter.post('/finalize/:id', adminMiddleware, finalizeContest);

/** Public catalogue — browsing contests must work without JWT (register/submit remain protected). */
contestRouter.get('/all', getAllContests);
contestRouter.get('/leaderboard/global', userMiddleware, getGlobalLeaderboard);
contestRouter.get('/rating', userMiddleware, getUserRating);
contestRouter.get('/rating/:userId', userMiddleware, getUserRating);
contestRouter.get('/:id', userMiddleware.optionalUser, getContestById);
contestRouter.post('/:id/register', userMiddleware, registerForContest);
contestRouter.post('/:contestId/submit/:problemId', userMiddleware, submitContestCode);
contestRouter.get('/:id/leaderboard', getLeaderboard);
contestRouter.get('/:contestId/my-submissions', userMiddleware, getMyContestSubmissions);

module.exports = contestRouter;
