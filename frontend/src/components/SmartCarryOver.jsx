import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiCalendar, FiCheck, FiX } from 'react-icons/fi';
import { format, isYesterday, isBefore, startOfDay } from 'date-fns';
import { fetchTasks, updateTask } from '../store/taskSlice';
import { addNotification } from '../store/uiSlice';

const SmartCarryOver = React.memo(() => {
  const dispatch = useDispatch();
  const { items: tasks } = useSelector((state) => state.tasks);
  const { theme } = useSelector((state) => state.ui);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Check for pending tasks from previous days (only uncompleted)
  useEffect(() => {
    const checkPendingTasks = () => {
      const today = startOfDay(new Date());
      // Only show uncompleted tasks
      const pending = tasks.filter(task => {
        if (task.completed || !task.dueDate) return false;
        
        const taskDueDate = startOfDay(new Date(task.dueDate));
        return isBefore(taskDueDate, today);
      });

      setPendingTasks(pending);
      
      // Show modal if there are pending uncompleted tasks
      if (pending.length > 0) {
        setShowModal(true);
      }
    };

    if (tasks.length > 0) {
      checkPendingTasks();
    }
  }, [tasks]);

  const handleMoveToToday = useCallback(async (taskId) => {
    setProcessing(true);
    try {
      await dispatch(
        updateTask({
          id: taskId,
          updates: {
            dueDate: format(new Date(), 'yyyy-MM-dd'),
            isCarriedOver: true,
          },
        })
      ).unwrap();

      dispatch(
        addNotification({
          type: 'success',
          message: 'Task moved to today!',
        })
      );

      // Remove from pending list
      setPendingTasks(prev => prev.filter(t => t._id !== taskId));
    } catch (error) {
      dispatch(
        addNotification({
          type: 'error',
          message: 'Failed to move task',
        })
      );
    } finally {
      setProcessing(false);
    }
  }, [dispatch]);

  const handleMoveAllToToday = useCallback(async () => {
    setProcessing(true);
    try {
      const promises = pendingTasks.map(task =>
        dispatch(
          updateTask({
            id: task._id,
            updates: {
              dueDate: format(new Date(), 'yyyy-MM-dd'),
              isCarriedOver: true,
            },
          })
        ).unwrap()
      );

      await Promise.all(promises);

      dispatch(
        addNotification({
          type: 'success',
          message: `${pendingTasks.length} tasks moved to today!`,
        })
      );

      setPendingTasks([]);
      setShowModal(false);
    } catch (error) {
      dispatch(
        addNotification({
          type: 'error',
          message: 'Failed to move some tasks',
        })
      );
    } finally {
      setProcessing(false);
    }
  }, [dispatch, pendingTasks]);

  const handleDismiss = useCallback((taskId) => {
    setPendingTasks(prev => prev.filter(t => t._id !== taskId));
    if (pendingTasks.length <= 1) {
      setShowModal(false);
    }
  }, [pendingTasks.length]);

  const handleDismissAll = useCallback(() => {
    setPendingTasks([]);
    setShowModal(false);
  }, []);

  if (pendingTasks.length === 0) return null;

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-8 transition-colors ${
              theme === 'dark'
                ? 'bg-slate-800 border border-slate-700'
                : 'bg-white border border-slate-200'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <FiAlertCircle className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Pending Tasks from Previous Days
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {pendingTasks.length} task{pendingTasks.length !== 1 ? 's' : ''} need{pendingTasks.length === 1 ? 's' : ''} your attention
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-slate-700 text-slate-300'
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Bulk Actions */}
            <div className="flex gap-3 mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleMoveAllToToday}
                disabled={processing}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <FiCheck className="w-5 h-5" />
                Move All to Today
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDismissAll}
                disabled={processing}
                className={`px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 ${
                  theme === 'dark'
                    ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                    : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                }`}
              >
                Dismiss All
              </motion.button>
            </div>

            {/* Task List */}
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`rounded-xl p-5 border-2 transition-colors ${
                    theme === 'dark'
                      ? 'bg-slate-700/50 border-slate-600'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        {task.text}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-4 h-4" />
                          Was due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                          {isYesterday(new Date(task.dueDate)) && ' (Yesterday)'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          task.priority === 'high'
                            ? 'bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-300'
                            : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-300'
                            : 'bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300'
                        }`}>
                          {task.priority}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          task.category === 'work'
                            ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300'
                            : task.category === 'personal'
                            ? 'bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-300'
                            : task.category === 'health'
                            ? 'bg-pink-100 text-pink-900 dark:bg-pink-900/30 dark:text-pink-300'
                            : 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          {task.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleMoveToToday(task._id)}
                        disabled={processing}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                      >
                        Move to Today
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDismiss(task._id)}
                        disabled={processing}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm disabled:opacity-50 ${
                          theme === 'dark'
                            ? 'bg-slate-600 text-slate-200 hover:bg-slate-500'
                            : 'bg-slate-300 text-slate-900 hover:bg-slate-400'
                        }`}
                      >
                        Dismiss
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className={`mt-6 pt-6 border-t transition-colors ${
              theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
            }`}>
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                💡 Tip: Set realistic deadlines and review your tasks daily to stay on track!
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

SmartCarryOver.displayName = 'SmartCarryOver';

export default SmartCarryOver;
