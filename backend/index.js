import express from 'express'
import  mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

import  todoRouter from './route/todo.rout.js';
import  userRoute from './route/user.rout.js';

const app = express()
const port = 4001

dotenv.config();
const PORT = process.env.PORT || port;

const DB_URI = process.env.MONGODB_URI;

//middlewares


app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// DATABASE CONNECTION CODE
try{
   await mongoose.connect(DB_URI)
    console.log("connected to mongo db")

} catch(error)
{
    console.log(error)

}

app.use("/todo", todoRouter);
app.use("/user", userRoute);

// app.use("/user", userRoute);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
