# 🚀 Deployment Checklist

## ✅ Pre-Deployment Verification

- [x] Frontend environment variables configured
- [x] Backend environment variables configured
- [x] API URLs updated to use environment variables
- [x] .gitignore created
- [x] .env.example files created
- [x] README.md updated with instructions
- [x] Local testing passed (signup, login, create/update/delete todos)

## 📋 Deployment Steps

### Step 1: Initialize Git Repository
```bash
cd c:\Users\umyad\Desktop\TodoApp
git init
git config user.name "Your Name"
git config user.email "your.email@gmail.com"
git add .
git commit -m "Initial commit: Complete MERN TodoApp with deployment ready"
```

### Step 2: Create GitHub Repository
1. Go to https://github.com/new
2. Create repository named: `TodoApp`
3. Do NOT initialize with README (we already have one)
4. Click "Create repository"

### Step 3: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/TodoApp.git
git branch -M main
git push -u origin main
```

### Step 4: Deploy Frontend (Vercel)
1. Go to https://vercel.com/login
2. Sign in with GitHub
3. Click "New Project"
4. Select "TodoApp" repository
5. Configure:
   - Framework: Vite (auto-detected)
   - Root Directory: `frontend`
6. Click "Deploy"
7. After deployment, get your Vercel URL (e.g., `https://todoapp-xyz.vercel.app`)

### Step 5: Deploy Backend (Railway)
1. Go to https://railway.app/login
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select "TodoApp" repository
5. In Railway dashboard:
   - Go to "Settings" → "Root Directory": set to `backend`
6. Click "Trigger Deploy"
7. Get your Railway backend URL

### Step 6: Configure Environment Variables

**In Vercel (Frontend):**
- Go to Settings → Environment Variables
- Add: `VITE_API_URL` = `https://your-railway-url.railway.app`
- Redeploy

**In Railway (Backend):**
- Go to Variables
- Add these:
  ```
  FRONTEND_URL=https://your-vercel-url.vercel.app
  MONGODB_URI=<your existing MongoDB URI>
  JWT_SECRET=<your existing JWT secret>
  PORT=5000
  ```

### Step 7: Test Production
1. Visit your Vercel frontend URL
2. Try signup → login → add todo → complete todo → delete todo
3. Everything should work! 🎉

## 🔧 Troubleshooting

### CORS Error
- Check `FRONTEND_URL` in Railway matches your Vercel URL exactly
- Wait 2-3 minutes after deploying for environment variables to take effect

### API Not Responding
- Check Railway logs for errors
- Verify MongoDB connection is working
- Check your MongoDB Atlas IP whitelist

### Login Not Working
- Verify JWT_SECRET is set in Railway
- Check browser console for specific error

## 📊 Monitoring

- **Vercel**: Dashboard shows deployment status and logs
- **Railway**: Dashboard shows deployment status, logs, and metrics

## 💾 Backup & Maintenance

- Your MongoDB is hosted on MongoDB Atlas - automatically backed up
- GitHub serves as your code backup
- Both Vercel and Railway have version history

## 🆘 Need Help?

1. Check browser console (F12) for frontend errors
2. Check Railway logs for backend errors
3. Verify environment variables are set correctly
4. Ensure IP whitelist on MongoDB Atlas includes Railway IP

## 📝 Next Steps (Optional)

- [ ] Add custom domain
- [ ] Set up GitHub Actions for CI/CD
- [ ] Add email verification for signup
- [ ] Implement todo categories/tags
- [ ] Add dark mode toggle
- [ ] Set up automated backups

---

Good luck with your deployment! 🚀
