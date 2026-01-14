# Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (for frontend)
- Render account (for backend)
- MongoDB Atlas account (for database)

## Step 1: Prepare MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier works)
3. Create a database user with password
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/todoapp`)
5. Whitelist all IP addresses (0.0.0.0/0) for Render deployment

## Step 2: Push to GitHub
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - TodoApp ready for deployment"

# Add your GitHub repository
git remote add origin https://github.com/yourusername/todoapp.git

# Push to GitHub
git push -u origin main
```

## Step 3: Deploy Backend to Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: todoapp-backend
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   
5. Add Environment Variables:
   - `MONGO_URL` = your MongoDB Atlas connection string
   - `JWT_SECRET` = any random secure string (e.g., use a password generator)
   - `PORT` = 4001
   
6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL (e.g., `https://todoapp-backend.onrender.com`)

**Important**: Free tier on Render spins down after inactivity. First request may take 30-60 seconds.

## Step 4: Deploy Frontend to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   
5. Add Environment Variable:
   - `VITE_API_URL` = your Render backend URL (from Step 3)
   
6. Click "Deploy"
7. Wait for deployment (2-3 minutes)
8. Your app will be live at `https://your-app.vercel.app`

## Step 5: Update CORS (if needed)
If you get CORS errors, update `backend/index.js`:
```javascript
app.use(cors({
  origin: ['https://your-app.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

Then redeploy backend on Render.

## Step 6: Test Your Deployed App
1. Visit your Vercel URL
2. Sign up for a new account
3. Create some tasks
4. Add journal entries
5. Check analytics

## Environment Variables Summary

### Backend (Render)
```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/todoapp
JWT_SECRET=your-random-secure-string-here
PORT=4001
```

### Frontend (Vercel)
```
VITE_API_URL=https://todoapp-backend.onrender.com
```

## Troubleshooting

### Backend issues:
- Check Render logs for errors
- Verify MongoDB connection string
- Ensure MongoDB IP whitelist includes 0.0.0.0/0

### Frontend issues:
- Verify VITE_API_URL points to backend
- Check browser console for errors
- Ensure backend is running (visit backend URL)

### CORS issues:
- Update backend CORS origin with your Vercel URL
- Redeploy backend after changes

## Updating Your App
```bash
# Make your changes
git add .
git commit -m "Your update message"
git push

# Both Vercel and Render will auto-deploy on push
```

## Cost
- MongoDB Atlas: Free tier (512MB storage)
- Render: Free tier (750 hours/month)
- Vercel: Free tier (unlimited projects)

**Total: $0/month for personal use**

## Notes
- Render free tier sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- Upgrade to paid tier ($7/month) for always-on backend
