import Todo from "../model/todo.model.js";

export const createTodo = async (req, res) => {
    try {
        const { text, completed, priority, category, dueDate } = req.body;
        
        const todo = new Todo({
            userId: req.userId,
            text,
            completed: completed || false,
            priority: priority || 'medium',
            category: category || 'other',
            dueDate: dueDate || null
        });

        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "error occured in todo creation" });
    }
};

export const getTodos = async (req, res) => {
    try {
        const { category, priority } = req.query;
        const query = { userId: req.userId };

        if (category && category !== 'all') {
            query.category = category;
        }
        if (priority && priority !== 'all') {
            query.priority = priority;
        }

        const todos = await Todo.find(query).sort({ order: 1, createdAt: -1 });
        res.status(200).json(todos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "error occured in fetching todos" });
    }
};

export const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findById(id);

        // Check if the todo belongs to the authenticated user
        if (todo.userId.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized to update this todo" });
        }

        const updatedTodo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedTodo);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "error occured in updating todo" });
    }
}

export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findById(id);

        // Check if the todo belongs to the authenticated user
        if (todo.userId.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized to delete this todo" });
        }

        await Todo.findByIdAndDelete(id);
        res.status(200).json({ message: "todo deleted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "error occured in deleting todo" });
    }
}

// Get overdue tasks that need to be carried over
export const getOverdueTasks = async (req, res) => {
    try {
        const userId = req.userId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const overdueTasks = await Todo.find({
            userId,
            completed: false,
            dueDate: { $lt: today },
            isCarriedOver: false
        });

        res.status(200).json(overdueTasks);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "error fetching overdue tasks" });
    }
};

// Carry over tasks to the next day
export const carryOverTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { newDueDate } = req.body;
        
        const todo = await Todo.findById(id);

        if (!todo || todo.userId.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        todo.isCarriedOver = true;
        todo.carriedOverFrom = todo.dueDate;
        todo.dueDate = newDueDate || new Date();
        
        await todo.save();
        res.status(200).json(todo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "error carrying over task" });
    }
};

// Reorder tasks (for drag and drop)
export const reorderTasks = async (req, res) => {
    try {
        const { tasks } = req.body; // Array of {id, order}
        
        const bulkOps = tasks.map(task => ({
            updateOne: {
                filter: { _id: task.id, userId: req.userId },
                update: { order: task.order }
            }
        }));

        await Todo.bulkWrite(bulkOps);
        res.status(200).json({ message: "Tasks reordered successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "error reordering tasks" });
    }
};

// Get task analytics
export const getTaskAnalytics = async (req, res) => {
    try {
        const userId = req.userId;
        const { days = 7 } = req.query;
        
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));
        startDate.setHours(0, 0, 0, 0);

        const tasks = await Todo.find({
            userId,
            createdAt: { $gte: startDate }
        });

        // Calculate analytics
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.completed).length;
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        // By category
        const byCategory = tasks.reduce((acc, task) => {
            acc[task.category] = acc[task.category] || { total: 0, completed: 0 };
            acc[task.category].total++;
            if (task.completed) acc[task.category].completed++;
            return acc;
        }, {});

        // By priority
        const byPriority = tasks.reduce((acc, task) => {
            acc[task.priority] = acc[task.priority] || { total: 0, completed: 0 };
            acc[task.priority].total++;
            if (task.completed) acc[task.priority].completed++;
            return acc;
        }, {});

        // Daily completion (for chart)
        const dailyStats = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const dayTasks = tasks.filter(t => {
                const taskDate = new Date(t.createdAt);
                return taskDate >= date && taskDate < nextDate;
            });

            dailyStats.push({
                date: date.toISOString().split('T')[0],
                total: dayTasks.length,
                completed: dayTasks.filter(t => t.completed).length
            });
        }

        res.status(200).json({
            totalTasks,
            completedTasks,
            completionRate: Math.round(completionRate),
            byCategory,
            byPriority,
            dailyStats
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "error fetching analytics" });
    }
};


