import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  // Force dark mode only. Ignore saved preference to ensure the app remains dark-only.
  return 'dark';
};

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: getInitialTheme(),
    sidebarOpen: true,
    activeView: 'tasks', // 'tasks', 'journal', 'analytics'
    showCarryOverModal: false,
    notifications: [],
  },
  reducers: {
    toggleTheme: (state) => {
      // Keep theme dark-only: toggling does nothing and always enforces dark theme.
      state.theme = 'dark';
      localStorage.setItem('theme', state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', state.theme);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setActiveView: (state, action) => {
      state.activeView = action.payload;
    },
    setShowCarryOverModal: (state, action) => {
      state.showCarryOverModal = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setActiveView,
  setShowCarryOverModal,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
