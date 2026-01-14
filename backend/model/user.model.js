import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    username: {
        type: String,
        required : true
    },
    email: {
        type: String,
        required : true,
        unique: true,
    },
    password: {
        type: String,
        required : true  

    },
    token: {
        type: String,
    },
    preferences: {
        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light'
        },
        defaultCategory: {
            type: String,
            enum: ['work', 'personal', 'health', 'other'],
            default: 'other'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
});

const User = mongoose.model('User', userSchema);
export default User;