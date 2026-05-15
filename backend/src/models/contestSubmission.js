const mongoose = require('mongoose');
const { Schema } = mongoose;

const contestSubmissionSchema = new Schema({
    contestId: { type: Schema.Types.ObjectId, ref: 'contest', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    problemId: { type: Schema.Types.ObjectId, ref: 'problem', required: true },
    code: { type: String, required: true },
    language: { type: String, required: true, enum: ['javascript', 'c++', 'java'] },
    status: { type: String, enum: ['pending', 'accepted', 'wrong', 'error'], default: 'pending' },
    runtime: { type: Number, default: 0 },
    memory: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    testCasesPassed: { type: Number, default: 0 },
    testCasesTotal: { type: Number, default: 0 },
    errorMessage: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

contestSubmissionSchema.index({ contestId: 1, userId: 1, problemId: 1 });
contestSubmissionSchema.index({ contestId: 1, status: 1 });

const ContestSubmission = mongoose.model('contestSubmission', contestSubmissionSchema);
module.exports = ContestSubmission;
