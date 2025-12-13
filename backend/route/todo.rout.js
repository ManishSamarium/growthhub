import express from 'express';

import { createTodo, getTodos,updateTodo, deleteTodo } from '../controller/todo.control.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router()

router.post('/create', verifyToken, createTodo);

router.get("/fetch", verifyToken, getTodos);

router.put("/update/:id", verifyToken, updateTodo);

router.delete("/delete/:id", verifyToken, deleteTodo);



export default router;