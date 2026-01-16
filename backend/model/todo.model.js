import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    category: {
        type: String,
        enum: ['work', 'personal', 'health', 'other'],
        default: 'other'
    },
    dueDate: {
        type: Date,
        default: null
    },
    isCarriedOver: {
        type: Boolean,
        default: false
    },
    carriedOverFrom: {
        type: Date,
        default: null
    },
    order: {
        type: Number,
        default: 0
    },
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
})

// Add indexes for better query performance
todoSchema.index({ userId: 1, completed: 1, dueDate: 1 });
todoSchema.index({ userId: 1, createdAt: -1 });
todoSchema.index({ userId: 1, order: 1 });

const Todo = mongoose.model('Todo', todoSchema);
export default Todo;
