const mongoose = require('mongoose');
const { Schema } = mongoose;

const userRatingSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true, unique: true },
    rating: { type: Number, default: 1500 },
    maxRating: { type: Number, default: 1500 },
    contestsPlayed: { type: Number, default: 0 },
    ratingHistory: [{
        contestId: { type: Schema.Types.ObjectId, ref: 'contest' },
        contestTitle: { type: String },
        oldRating: { type: Number },
        newRating: { type: Number },
        rank: { type: Number },
        delta: { type: Number },
        date: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

userRatingSchema.index({ rating: -1 });
userRatingSchema.index({ userId: 1 });

const UserRating = mongoose.model('userRating', userRatingSchema);
module.exports = UserRating;
