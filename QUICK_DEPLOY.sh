#!/bin/bash

# 🚀 TodoApp Quick Deploy Guide

echo "======================================"
echo "   TodoApp - Quick Deployment Guide   "
echo "======================================"

echo ""
echo "📦 STEP 1: Initialize Git Repository"
echo "======================================"
cd "C:\Users\umyad\Desktop\TodoApp"
git init
git config user.name "Your Name"
git config user.email "your.email@gmail.com"
git add .
git commit -m "Initial commit: Complete MERN TodoApp"
echo "✅ Git repository initialized"

echo ""
echo "📤 STEP 2: Create GitHub Repository"
echo "======================================"
echo "1. Visit: https://github.com/new"
echo "2. Create repo name: TodoApp"
echo "3. Copy the URL provided (e.g., https://github.com/YOUR_USERNAME/TodoApp.git)"
echo "4. Replace GITHUB_URL in the next command"

read -p "Enter your GitHub repository URL: " GITHUB_URL

git remote add origin "$GITHUB_URL"
git branch -M main
git push -u origin main
echo "✅ Code pushed to GitHub"

echo ""
echo "🌐 STEP 3: Deploy Frontend"
echo "======================================"
echo "1. Visit: https://vercel.com/login (sign in with GitHub)"
echo "2. Click 'New Project'"
echo "3. Select 'TodoApp' repository"
echo "4. Set Root Directory to: frontend"
echo "5. Click 'Deploy'"
echo "6. After deployment, note your Vercel URL (e.g., https://todoapp-xyz.vercel.app)"

read -p "Enter your Vercel frontend URL: " VERCEL_URL

echo ""
echo "⚙️ STEP 4: Deploy Backend"
echo "======================================"
echo "1. Visit: https://railway.app/login (sign in with GitHub)"
echo "2. Click 'New Project' → 'Deploy from GitHub repo'"
echo "3. Select 'TodoApp' repository"
echo "4. In Railway Settings, set Root Directory to: backend"
echo "5. Click 'Trigger Deploy'"
echo "6. After deployment, note your Railway URL"

read -p "Enter your Railway backend URL: " RAILWAY_URL

echo ""
echo "🔐 STEP 5: Configure Environment Variables"
echo "======================================"
echo ""
echo "In Vercel (Frontend):"
echo "1. Go to Settings → Environment Variables"
echo "2. Add: VITE_API_URL = $RAILWAY_URL"
echo "3. Click 'Deploy' button to redeploy"
echo ""
echo "In Railway (Backend):"
echo "1. Go to Variables"
echo "2. Add these environment variables:"
echo "   - FRONTEND_URL = $VERCEL_URL"
echo "   - MONGODB_URI = (your existing MongoDB URI)"
echo "   - JWT_SECRET = (your existing JWT secret)"
echo "   - PORT = 5000"
echo ""

read -p "Press Enter after setting environment variables in both platforms..."

echo ""
echo "✅ STEP 6: Test Your Deployment"
echo "======================================"
echo "Visit: $VERCEL_URL"
echo ""
echo "Try these actions:"
echo "1. ✅ Sign up with a new account"
echo "2. ✅ Log in"
echo "3. ✅ Create a todo"
echo "4. ✅ Mark todo as complete"
echo "5. ✅ Delete a todo"
echo "6. ✅ Log out"
echo ""
echo "If everything works, your app is deployed! 🎉"

echo ""
echo "======================================"
echo "   Deployment Complete!               "
echo "======================================"
echo ""
echo "📊 Your App URLs:"
echo "Frontend:  $VERCEL_URL"
echo "Backend:   $RAILWAY_URL"
echo "Database:  MongoDB Atlas (cloud)"
echo ""
echo "📚 Documentation:"
echo "- README.md - Project overview"
echo "- DEPLOYMENT.md - Detailed deployment guide"
echo "- DEPLOYMENT_CHECKLIST.md - Step-by-step checklist"
echo ""
echo "🆘 Troubleshooting:"
echo "- CORS Error → Check FRONTEND_URL matches exactly in Railway"
echo "- API Error → Check Railway logs for connection errors"
echo "- Login Error → Check JWT_SECRET is set in Railway"
echo ""
