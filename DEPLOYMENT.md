# TodoApp Deployment Guide

## 🚀 Quick Deployment

This guide covers deploying your MERN TodoApp to production.

### Prerequisites
- GitHub account (free)
- Vercel account (free)
- Railway or Render account (free)

---

## **Part 1: Prepare Your Project**

### 1.1 Initialize Git Repository
```bash
cd c:\Users\umyad\Desktop\TodoApp
git init
git add .
git commit -m "Initial commit: Full MERN TodoApp"
```

### 1.2 Create GitHub Repository
1. Go to [GitHub.com](https://github.com/new)
2. Create a new repository called `TodoApp`
3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/TodoApp.git
git branch -M main
git push -u origin main
```

---

## **Part 2: Deploy Frontend (Vercel)**

### 2.1 Connect GitHub to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select your `TodoApp` repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - Click "Deploy"

### 2.2 Add Environment Variables
After deployment, go to **Settings → Environment Variables**:
```
VITE_API_URL=https://your-backend-url.com
```

Replace with your actual backend URL (from Step 3)

### 2.3 Update Frontend API Calls
In `frontend/src/components/Home.jsx`, `Login.jsx`, `Signup.jsx`:
Change all `http://localhost:4001` to `process.env.VITE_API_URL`

Example:
```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001";

// Then use:
axios.get(`${API_URL}/todo/fetch`, ...)
```

---

## **Part 3: Deploy Backend (Railway)**

### 3.1 Deploy to Railway
1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project → GitHub Repo"
4. Select your `TodoApp` repository
5. Select `backend` as the root directory

### 3.2 Add Environment Variables
In Railway dashboard:
- Go to **Variables**
- Add:
  ```
  PORT=4001
  MONGODB_URI=your_mongodb_atlas_uri
  JWT_SECRET=your_secure_jwt_secret
  FRONTEND_URL=https://your-vercel-url.vercel.app
  ```

### 3.3 Deploy
- Railway will automatically build and deploy
- Get your deployed URL from the Railway dashboard

---

## **Part 4: Update CORS**

Update `backend/index.js` to accept your deployed frontend URL:

```javascript
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5174",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
```

---

## **Part 5: Final Setup**

### 5.1 Update Frontend Environment
Create `frontend/.env.production`:
```
VITE_API_URL=https://your-railway-backend-url.railway.app
```

### 5.2 Rebuild and Deploy
```bash
cd frontend
npm run build
git add .
git commit -m "Update API URLs for production"
git push
```

Vercel will auto-redeploy.

---

## **Summary**

| Component | Platform | Cost | URL |
|-----------|----------|------|-----|
| Frontend | Vercel | Free | vercel.app |
| Backend | Railway | Free (with credits) | railway.app |
| Database | MongoDB Atlas | Free | Existing |

---

## **Testing Production**

1. Visit your Vercel frontend URL
2. Try signup/login
3. Add, complete, delete todos
4. All should work seamlessly!

---

## **Troubleshooting**

**CORS Error?**
- Check `FRONTEND_URL` in backend environment variables
- Ensure it matches your Vercel URL exactly

**API not connecting?**
- Verify backend is running on Railway
- Check `VITE_API_URL` in frontend env
- Open browser console for errors

**Login not working?**
- Verify JWT_SECRET is set in backend
- Check MongoDB connection

---

## **Next Steps (Optional)**

- Add custom domain
- Set up CI/CD with GitHub Actions
- Add monitoring/logging
- Database backups

Good luck! 🚀
