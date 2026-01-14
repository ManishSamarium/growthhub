import express from 'express';

import { 
    createTodo, 
    getTodos, 
    updateTodo, 
    deleteTodo, 
    getOverdueTasks, 
    carryOverTask, 
    reorderTasks,
    getTaskAnalytics 
} from '../controller/todo.control.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router()

router.post('/create', verifyToken, createTodo);
router.get("/fetch", verifyToken, getTodos);
router.put("/update/:id", verifyToken, updateTodo);
router.delete("/delete/:id", verifyToken, deleteTodo);
router.get("/overdue", verifyToken, getOverdueTasks);
router.put("/carry-over/:id", verifyToken, carryOverTask);
router.post("/reorder", verifyToken, reorderTasks);
router.get("/analytics", verifyToken, getTaskAnalytics);

export default router;