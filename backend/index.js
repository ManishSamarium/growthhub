import express from 'express'
import  mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import  todoRouter from './route/todo.rout.js';
import  userRoute from './route/user.rout.js';
import journalRoute from './route/journal.rout.js';

const app = express()
const port = 4001

dotenv.config();
const PORT = process.env.PORT || port;

// Prefer environment variable, otherwise fall back to a local MongoDB instance.
// Users should set MONGODB_URI in a .env for production (MongoDB Atlas).
const DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/growthhub';

//middlewares


app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests from localhost with any port during development
        if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// DATABASE CONNECTION CODE
try {
    if (DB_URI.startsWith('mongodb+srv://')) {
        // Atlas SRV connection string - do not use directConnection
        await mongoose.connect(DB_URI);
    } else {
        // Local or standard connection
        await mongoose.connect(DB_URI, { directConnection: true });
    }
    console.log("connected to mongo db")
} catch (error) {
    console.error("Failed to connect to MongoDB. Please ensure MONGODB_URI is set or MongoDB is running locally.", error.message);
}

app.use("/todo", todoRouter);
app.use("/user", userRoute);
app.use("/journal", journalRoute);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
