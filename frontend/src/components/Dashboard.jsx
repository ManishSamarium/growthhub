import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiCheckSquare,
  FiBookOpen,
  FiBarChart2,
  FiMoon,
  FiSun,
  FiMenu,
  FiX,
  FiLogOut,
} from 'react-icons/fi';
import { toggleTheme, toggleSidebar, setActiveView } from '../store/uiSlice';
import { fetchOverdueTasks } from '../store/taskSlice';
import TaskView from './TaskView';
import JournalView from './JournalView';
import AnalyticsView from './AnalyticsView';
import SmartCarryOver from './SmartCarryOver';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, sidebarOpen, activeView } = useSelector((state) => state.ui);
  const { overdueTasks } = useSelector((state) => state.tasks);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
    
    // Check for overdue tasks on mount
    dispatch(fetchOverdueTasks());
  }, [navigate, dispatch]);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { id: 'tasks', label: 'Tasks', icon: FiCheckSquare },
    { id: 'journal', label: 'Journal', icon: FiBookOpen },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart2 },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'tasks':
        return <TaskView />;
      case 'journal':
        return <JournalView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <TaskView />;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50'}`}>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25 }}
            className={`fixed left-0 top-0 h-screen w-64 z-50 ${
              theme === 'dark'
                ? 'bg-gray-800/90 backdrop-blur-xl border-r border-gray-700'
                : 'bg-white/70 backdrop-blur-xl border-r border-white/20'
            } shadow-2xl`}
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Growth Hub
                </h2>
                <button
                  onClick={() => dispatch(toggleSidebar())}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <FiX className="w-5 h-5 text-gray-800 dark:text-gray-200" />
                </button>
              </div>
              <p className="text-sm text-gray-900 dark:text-gray-300 font-medium">
                Welcome, <span className="font-semibold text-gray-900 dark:text-white">{user?.username}</span>
              </p>
            </div>

            {/* Navigation */}
            <nav className="p-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => dispatch(setActiveView(item.id))}
                    className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                        : theme === 'dark'
                        ? 'text-gray-200 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-900 hover:bg-white/70 font-semibold'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>

            {/* Theme Toggle & Logout */}
            <div className="absolute bottom-6 left-4 right-4 space-y-3">
              {/* <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { if (theme !== 'dark') dispatch(toggleTheme()); }}
                disabled={theme === 'dark'}
                className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-gray-100 opacity-70 cursor-default'
                    : 'bg-white/70 text-gray-900 hover:bg-white font-semibold'
                }`}
              >
                {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </motion.button> */}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all"
              >
                <FiLogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <header className={`sticky top-0 z-40 ${
          theme === 'dark'
            ? 'bg-gray-800/80 backdrop-blur-xl border-b border-gray-700'
            : 'bg-white/70 backdrop-blur-xl border-b border-white/20'
        } shadow-sm`}>
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => dispatch(toggleSidebar())}
                className={`p-2 rounded-lg transition ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700 text-gray-200'
                    : 'hover:bg-gray-100 text-gray-800'
                }`}
              >
                <FiMenu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {menuItems.find((item) => item.id === activeView)?.label || 'Dashboard'}
              </h1>
            </div>

            {overdueTasks.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-semibold"
              >
                <span>{overdueTasks.length} tasks need attention</span>
              </motion.div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </main>
      </div>

      {/* Smart Carry Over Modal */}
      <SmartCarryOver />
    </div>
  );
};

export default Dashboard;
