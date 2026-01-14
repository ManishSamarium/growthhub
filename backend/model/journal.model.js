import mongoose from "mongoose";

const journalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    entryDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    mood: {
        type: String,
        enum: ['great', 'good', 'okay', 'bad', 'terrible', null],
        default: null
    },
    tags: [{
        type: String,
        trim: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient date-based searches
journalSchema.index({ userId: 1, entryDate: -1 });

const Journal = mongoose.model('Journal', journalSchema);
export default Journal;
