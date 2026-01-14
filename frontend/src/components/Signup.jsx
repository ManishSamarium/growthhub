import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `/user/signup`,
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );

      console.log("Signup response:", response.data);
      if (response.data) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.newUser));
        navigate("/");
      }
    } catch (err) {
      console.error("Signup error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Signup failed. Try again.";
      
      // Enhance common error messages
      if (errorMsg.includes("already registerd") || errorMsg.includes("already registered")) {
        setError("This email is already registered. Please login instead or use a different email.");
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Create Account
          </h1>
          <p className="text-gray-300">Join us to organize your tasks</p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-200 font-semibold mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 text-white rounded-lg focus:outline-none focus:border-purple-500 transition placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-gray-200 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 text-white rounded-lg focus:outline-none focus:border-purple-500 transition placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-gray-200 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 text-white rounded-lg focus:outline-none focus:border-purple-500 transition placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-gray-200 font-semibold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 text-white rounded-lg focus:outline-none focus:border-purple-500 transition placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-400 font-bold hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
