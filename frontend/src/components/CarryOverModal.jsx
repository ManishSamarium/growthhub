import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import { format, addDays } from 'date-fns';
import { carryOverTask, fetchTasks } from '../store/taskSlice';
import { setShowCarryOverModal, addNotification } from '../store/uiSlice';

const CarryOverModal = () => {
  const dispatch = useDispatch();
  const { overdueTasks } = useSelector((state) => state.tasks);
  const { showCarryOverModal, theme } = useSelector((state) => state.ui);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleCarryOver = async (taskId) => {
    try {
      await dispatch(
        carryOverTask({
          id: taskId,
          newDueDate: selectedDate,
        })
      ).unwrap();

      dispatch(
        addNotification({
          type: 'success',
          message: 'Task carried over successfully!',
        })
      );

      // Refresh tasks
      dispatch(fetchTasks({ category: 'all', priority: 'all' }));

      // Close modal if no more overdue tasks
      if (overdueTasks.length <= 1) {
        dispatch(setShowCarryOverModal(false));
      }
    } catch (error) {
      dispatch(
        addNotification({
          type: 'error',
          message: error || 'Failed to carry over task',
        })
      );
    }
  };

  const handleDismiss = (taskId) => {
    // Optionally implement dismiss logic
    // For now, just carry over to today
    handleCarryOver(taskId);
  };

  if (!showCarryOverModal && overdueTasks.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      {(showCarryOverModal || overdueTasks.length > 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => dispatch(setShowCarryOverModal(false))}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-2xl rounded-3xl shadow-2xl p-8 ${
              theme === 'dark'
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <FiAlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Overdue Tasks
                  </h2>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {overdueTasks.length} task{overdueTasks.length !== 1 ? 's' : ''} need{overdueTasks.length === 1 ? 's' : ''} your attention
                  </p>
                </div>
              </div>
              <button
                onClick={() => dispatch(setShowCarryOverModal(false))}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <FiX className="w-6 h-6 text-gray-800 dark:text-gray-200" />
              </button>
            </div>

            {/* Date Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Reschedule to:
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className={`flex-1 px-4 py-3 rounded-xl border-2 transition focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-200 text-gray-800'
                  }`}
                />
                <button
                  onClick={() => setSelectedDate(format(new Date(), 'yyyy-MM-dd'))}
                  className="px-4 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition"
                >
                  Today
                </button>
                <button
                  onClick={() => setSelectedDate(format(addDays(new Date(), 1), 'yyyy-MM-dd'))}
                  className="px-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition"
                >
                  Tomorrow
                </button>
              </div>
            </div>

            {/* Overdue Tasks List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {overdueTasks.map((task) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`rounded-xl p-4 border-2 ${
                    theme === 'dark'
                      ? 'bg-gray-700/50 border-gray-600'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {task.text}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <FiCalendar className="w-4 h-4" />
                        <span>
                          Was due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                        </span>
                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-xs font-semibold">
                          {task.priority}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-semibold">
                          {task.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCarryOver(task._id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition text-sm"
                      >
                        Reschedule
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDismiss(task._id)}
                        className="px-4 py-2 bg-gray-400 text-white rounded-lg font-medium hover:bg-gray-500 transition text-sm"
                      >
                        Dismiss
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                💡 Tip: Set realistic deadlines and review your tasks daily to stay on track!
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CarryOverModal;
