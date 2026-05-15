/**
 * ELO-style rating engine for contests.
 * Based on simplified Codeforces rating system.
 */

function getExpectedRank(rating, opponents) {
    let expected = 0;
    for (const oppRating of opponents) {
        expected += 1 / (1 + Math.pow(10, (oppRating - rating) / 400));
    }
    return opponents.length + 1 - expected;
}

function calculateNewRatings(participants) {
    const n = participants.length;
    if (n < 2) return participants.map(p => ({ ...p, newRating: p.rating, delta: 0 }));

    const allRatings = participants.map(p => p.rating);

    return participants.map(p => {
        const opponents = allRatings.filter((_, i) => i !== participants.indexOf(p));
        const expectedRank = getExpectedRank(p.rating, opponents);
        const actualRank = p.rank;

        let K = 40;
        if (p.rating >= 2000) K = 20;
        else if (p.rating >= 1500) K = 30;

        const performance = (expectedRank - actualRank) / n;
        let delta = Math.round(K * performance);

        delta = Math.max(-150, Math.min(150, delta));

        if (p.contestsPlayed < 5) {
            delta = Math.round(delta * 1.5);
        }

        const newRating = Math.max(1, p.rating + delta);

        return {
            userId: p.userId,
            oldRating: p.rating,
            newRating,
            delta: newRating - p.rating,
            rank: p.rank
        };
    });
}

function getRatingTitle(rating) {
    if (rating >= 2400) return 'Grandmaster';
    if (rating >= 2100) return 'Master';
    if (rating >= 1900) return 'Candidate Master';
    if (rating >= 1600) return 'Expert';
    if (rating >= 1400) return 'Specialist';
    if (rating >= 1200) return 'Pupil';
    return 'Newbie';
}

function getRatingColor(rating) {
    if (rating >= 2400) return '#ff0000';
    if (rating >= 2100) return '#ff8c00';
    if (rating >= 1900) return '#a0a';
    if (rating >= 1600) return '#0000ff';
    if (rating >= 1400) return '#03a89e';
    if (rating >= 1200) return '#008000';
    return '#808080';
}

module.exports = { calculateNewRatings, getRatingTitle, getRatingColor };
