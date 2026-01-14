import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FiTrendingUp, FiTarget, FiActivity, FiAward } from 'react-icons/fi';
import { fetchAnalytics } from '../store/taskSlice';

const AnalyticsView = () => {
  const dispatch = useDispatch();
  const { analytics, loading } = useSelector((state) => state.tasks);
  const { theme } = useSelector((state) => state.ui);
  const [days, setDays] = useState(7);

  useEffect(() => {
    dispatch(fetchAnalytics(days));
  }, [dispatch, days]);

  if (loading || !analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-900 dark:text-gray-200 text-lg font-medium">Loading analytics...</p>
      </div>
    );
  }

  const COLORS = {
    purple: '#8b5cf6',
    blue: '#3b82f6',
    green: '#10b981',
    yellow: '#f59e0b',
    red: '#ef4444',
    pink: '#ec4899',
  };

  const categoryData = Object.entries(analytics.byCategory).map(([name, data]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    total: data.total,
    completed: data.completed,
    pending: data.total - data.completed,
  }));

  const priorityData = Object.entries(analytics.byPriority).map(([name, data]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: data.total,
    completed: data.completed,
  }));

  const pieColors = [COLORS.purple, COLORS.blue, COLORS.green, COLORS.yellow];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-6 shadow-xl ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-purple-900/50 to-purple-800/50 backdrop-blur-xl border border-purple-700'
              : 'bg-gradient-to-br from-purple-100 to-purple-200 border border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <FiTarget className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {analytics.totalTasks}
          </h3>
          <p className="text-sm text-gray-900 dark:text-gray-200 font-semibold">Total Tasks</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-6 shadow-xl ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-green-900/50 to-green-800/50 backdrop-blur-xl border border-green-700'
              : 'bg-gradient-to-br from-green-100 to-green-200 border border-green-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <FiAward className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {analytics.completedTasks}
          </h3>
          <p className="text-sm text-gray-900 dark:text-gray-200 font-semibold">Completed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl p-6 shadow-xl ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-blue-900/50 to-blue-800/50 backdrop-blur-xl border border-blue-700'
              : 'bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <FiTrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {analytics.completionRate}%
          </h3>
          <p className="text-sm text-gray-900 dark:text-gray-200 font-semibold">Completion Rate</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-2xl p-6 shadow-xl ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-orange-900/50 to-orange-800/50 backdrop-blur-xl border border-orange-700'
              : 'bg-gradient-to-br from-orange-100 to-orange-200 border border-orange-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <FiActivity className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {analytics.totalTasks - analytics.completedTasks}
          </h3>
          <p className="text-sm text-gray-900 dark:text-gray-200 font-semibold">In Progress</p>
        </motion.div>
      </div>

      {/* Time Period Selector */}
      <div className={`rounded-2xl p-4 shadow-lg ${
        theme === 'dark'
          ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700'
          : 'bg-white/70 backdrop-blur-xl border border-white/20'
      }`}>
        <div className="flex items-center gap-4">
          <span className="text-gray-900 dark:text-gray-200 font-semibold">Show data for:</span>
          <div className="flex gap-2">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  days === d
                    ? 'bg-purple-500 text-white shadow-lg'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300 font-semibold'
                }`}
              >
                {d} days
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Completion Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-6 shadow-xl ${
            theme === 'dark'
              ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700'
              : 'bg-white/70 backdrop-blur-xl border border-white/20'
          }`}
        >
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Daily Task Completion
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.dailyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
              />
              <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="total" stroke={COLORS.blue} strokeWidth={2} name="Total Tasks" />
              <Line type="monotone" dataKey="completed" stroke={COLORS.green} strokeWidth={2} name="Completed" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-6 shadow-xl ${
            theme === 'dark'
              ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700'
              : 'bg-white/70 backdrop-blur-xl border border-white/20'
          }`}
        >
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Tasks by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="total"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Priority Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl p-6 shadow-xl ${
            theme === 'dark'
              ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700'
              : 'bg-white/70 backdrop-blur-xl border border-white/20'
          }`}
        >
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Tasks by Priority
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="name" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
              <Bar dataKey="value" fill={COLORS.purple} name="Total" />
              <Bar dataKey="completed" fill={COLORS.green} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Completion Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-2xl p-6 shadow-xl ${
            theme === 'dark'
              ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700'
              : 'bg-white/70 backdrop-blur-xl border border-white/20'
          }`}
        >
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Category Progress
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
              <XAxis type="number" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <YAxis type="category" dataKey="name" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
              <Bar dataKey="completed" stackId="a" fill={COLORS.green} name="Completed" />
              <Bar dataKey="pending" stackId="a" fill={COLORS.red} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsView;
