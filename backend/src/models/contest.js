const mongoose = require('mongoose');
const { Schema } = mongoose;

const contestSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true },
    problems: [{
        problemId: { type: Schema.Types.ObjectId, ref: 'problem', required: true },
        points: { type: Number, required: true, default: 100 },
        order: { type: Number, required: true }
    }],
    participants: [{
        userId: { type: Schema.Types.ObjectId, ref: 'user' },
        joinedAt: { type: Date, default: Date.now }
    }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    status: { type: String, enum: ['upcoming', 'live', 'ended'], default: 'upcoming' },
    isRated: { type: Boolean, default: true },
    maxParticipants: { type: Number, default: 0 },
    rules: { type: String, default: '' },
    penaltyTime: { type: Number, default: 20 }
}, { timestamps: true });

contestSchema.index({ status: 1, startTime: 1 });
contestSchema.index({ 'participants.userId': 1 });

const Contest = mongoose.model('contest', contestSchema);
module.exports = Contest;
