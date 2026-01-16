import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FiPlus, FiTrash2, FiEdit2, FiCalendar, FiFilter } from 'react-icons/fi';
import { format } from 'date-fns';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  setFilters,
  reorderTasks,
  updateTaskOrder,
} from '../store/taskSlice';
import { addNotification } from '../store/uiSlice';

// Memoized Task Item Component
const TaskItem = React.memo(({ 
  task, 
  index, 
  theme, 
  onToggleComplete, 
  onDelete,
  priorityColors,
  categoryColors 
}) => {
  return (
    <Draggable key={task._id} draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-5 shadow-lg transition-all ${
            snapshot.isDragging
              ? 'shadow-2xl scale-105'
              : ''
          } ${
            theme === 'dark'
              ? 'bg-gray-800/70 backdrop-blur-xl border border-gray-700'
              : 'bg-white/80 backdrop-blur-xl border border-white/20'
          }`}
        >
          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task)}
              className="w-6 h-6 mt-1 rounded-lg accent-purple-500 cursor-pointer"
            />

            <div className="flex-1">
              <p
                className={`text-lg mb-2 font-medium ${
                  task.completed
                    ? 'line-through text-gray-500 dark:text-gray-500'
                    : 'text-gray-900 dark:text-gray-100'
                }`}
              >
                {task.text}
              </p>

              <div className="flex flex-wrap gap-2 items-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[task.priority]}`}
                >
                  {task.priority}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[task.category]}`}
                >
                  {task.category}
                </span>
                {task.dueDate && (
                  <span className="flex items-center gap-1 text-xs text-gray-800 dark:text-gray-300 font-medium">
                    <FiCalendar className="w-3 h-3" />
                    {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                  </span>
                )}
                {task.isCarriedOver && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                    Carried Over
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => onDelete(task._id)}
              className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </Draggable>
  );
});

TaskItem.displayName = 'TaskItem';

const TaskView = () => {
  const dispatch = useDispatch();
  const { items: tasks, loading, filters } = useSelector((state) => state.tasks);
  const { theme } = useSelector((state) => state.ui);

  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskCategory, setNewTaskCategory] = useState('other');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  // Memoize color mappings
  const priorityColors = useMemo(() => ({
    low: 'bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300 font-semibold',
    medium: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-300 font-semibold',
    high: 'bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-300 font-semibold',
  }), []);

  const categoryColors = useMemo(() => ({
    work: 'bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300 font-semibold',
    personal: 'bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-300 font-semibold',
    health: 'bg-pink-100 text-pink-900 dark:bg-pink-900/30 dark:text-pink-300 font-semibold',
    other: 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-300 font-semibold',
  }), []);

  useEffect(() => {
    dispatch(fetchTasks({ category: filters.category, priority: filters.priority }));
  }, [dispatch, filters.category, filters.priority]);

  const handleCreateTask = useCallback(async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    try {
      await dispatch(
        createTask({
          text: newTaskText,
          priority: newTaskPriority,
          category: newTaskCategory,
          dueDate: newTaskDueDate || null,
        })
      ).unwrap();

      setNewTaskText('');
      setNewTaskPriority('medium');
      setNewTaskCategory('other');
      setNewTaskDueDate('');

      dispatch(
        addNotification({
          type: 'success',
          message: 'Task created successfully!',
        })
      );
    } catch (error) {
      dispatch(
        addNotification({
          type: 'error',
          message: error || 'Failed to create task',
        })
      );
    }
  }, [dispatch, newTaskText, newTaskPriority, newTaskCategory, newTaskDueDate]);

  const handleToggleComplete = useCallback(async (task) => {
    try {
      await dispatch(
        updateTask({
          id: task._id,
          updates: { completed: !task.completed },
        })
      ).unwrap();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }, [dispatch]);

  const handleDeleteTask = useCallback(async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await dispatch(deleteTask(id)).unwrap();
      dispatch(
        addNotification({
          type: 'success',
          message: 'Task deleted successfully!',
        })
      );
    } catch (error) {
      dispatch(
        addNotification({
          type: 'error',
          message: error || 'Failed to delete task',
        })
      );
    }
  }, [dispatch]);

  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;

    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);

    // Update local state immediately
    dispatch(updateTaskOrder(reorderedTasks));

    // Update order on server
    const taskUpdates = reorderedTasks.map((task, index) => ({
      id: task._id,
      order: index,
    }));
    dispatch(reorderTasks(taskUpdates));
  }, [tasks, dispatch]);

  // Memoize filtered tasks to avoid recalculation on every render
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.searchTerm) {
        return task.text.toLowerCase().includes(filters.searchTerm.toLowerCase());
      }
      return true;
    });
  }, [tasks, filters.searchTerm]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Create Task Form - Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 shadow-xl ${
          theme === 'dark'
            ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700'
            : 'bg-white/70 backdrop-blur-xl border border-white/20'
        }`}
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FiPlus className="w-6 h-6 text-gray-900 dark:text-gray-100" />
          <span className="text-gray-900 dark:text-gray-100">Create New Task</span>
        </h2>
        <form onSubmit={handleCreateTask} className="space-y-4">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="What needs to be done?"
            className={`w-full px-4 py-3 rounded-xl border-2 transition focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
            }`}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className={`px-4 py-3 rounded-xl border-2 transition focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <select
              value={newTaskCategory}
              onChange={(e) => setNewTaskCategory(e.target.value)}
              className={`px-4 py-3 rounded-xl border-2 transition focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <option value="other">Other</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="health">Health</option>
            </select>

            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className={`px-4 py-3 rounded-xl border-2 transition focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
          >
            Add Task
          </motion.button>
        </form>
      </motion.div>

      {/* Filters */}
      <div className={`rounded-2xl p-4 shadow-lg ${
        theme === 'dark'
          ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700'
          : 'bg-white/70 backdrop-blur-xl border border-white/20'
      }`}>
        <div className="flex items-center gap-4 flex-wrap">
          <FiFilter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          <select
            value={filters.category}
            onChange={(e) => dispatch(setFilters({ category: e.target.value }))}
            className={`px-4 py-2 rounded-lg border transition ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-200 text-gray-800'
            }`}
          >
            <option value="all">All Categories</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="health">Health</option>
            <option value="other">Other</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => dispatch(setFilters({ priority: e.target.value }))}
            className={`px-4 py-2 rounded-lg border transition ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-200 text-gray-800'
            }`}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Tasks List with Drag and Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {loading ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  Loading tasks...
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  No tasks yet. Create one to get started! 🚀
                </div>
              ) : (
                filteredTasks.map((task, index) => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    index={index}
                    theme={theme}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTask}
                    priorityColors={priorityColors}
                    categoryColors={categoryColors}
                  />
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TaskView;
