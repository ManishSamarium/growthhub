import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import PageNotFound from "./components/PageNotFound.jsx";
import Dashboard from "./components/Dashboard.jsx";
import { Route, Routes } from "react-router-dom";

const App = () => {
  const { theme } = useSelector((state) => state.ui);

  // Apply theme to document root with smooth transition
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Add transition class for smooth color changes
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  }, [theme]);

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

export default App;
