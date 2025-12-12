# 📝 TodoApp - MERN Stack

A modern, full-stack Todo application built with **React**, **Express**, **Node.js**, and **MongoDB**.

## ✨ Features

- 🔐 **User Authentication** - Secure signup/login with JWT
- ✅ **Todo Management** - Create, read, update, delete todos
- 📊 **Statistics** - Track completed vs total tasks
- 🎨 **Beautiful UI** - Modern design with Tailwind CSS
- 📱 **Responsive Design** - Works on all devices
- 🔄 **Real-time Updates** - Instant todo synchronization

## 🛠️ Tech Stack

### Frontend
- React 19 with Vite
- Tailwind CSS 4
- React Router v7
- Axios for API calls

### Backend
- Node.js with Express 5
- MongoDB with Mongoose
- JWT Authentication
- CORS support

### Database
- MongoDB Atlas (Cloud)

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Git

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/TodoApp.git
cd TodoApp
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run start
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔑 Environment Variables

### Backend (.env)
```
PORT=4001
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=http://localhost:5174
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:4001
```

## 🚀 Running Locally

1. **Start MongoDB** (should be running on MongoDB Atlas)

2. **Start Backend**
```bash
cd backend
npm run start
```
Server runs on: `http://localhost:4001`

3. **Start Frontend**
```bash
cd frontend
npm run dev
```
App runs on: `http://localhost:5174`

4. **Open in Browser**
Visit: `http://localhost:5174`

## 📚 API Endpoints

### Authentication
- `POST /user/signup` - Register new user
- `POST /user/login` - Login user
- `POST /user/logout` - Logout user

### Todos
- `GET /todo/fetch` - Get all todos
- `POST /todo/create` - Create new todo
- `PUT /todo/update/:id` - Update todo
- `DELETE /todo/delete/:id` - Delete todo

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy:**
- Frontend: Vercel
- Backend: Railway
- Database: MongoDB Atlas (already set up)

## 📂 Project Structure

```
TodoApp/
├── frontend/                 # React app
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── package.json
│   └── vite.config.js
├── backend/                 # Express server
│   ├── controller/          # Route controllers
│   ├── model/               # MongoDB models
│   ├── route/               # API routes
│   ├── jwt/                 # JWT utilities
│   ├── index.js             # Server entry
│   └── package.json
├── DEPLOYMENT.md            # Deployment guide
└── README.md                # This file
```

## 👤 User Flow

1. **Signup** - Create a new account
2. **Login** - Authenticate with email/password
3. **Dashboard** - View your todos with stats
4. **Add Todo** - Create new tasks
5. **Mark Complete** - Check off finished tasks
6. **Delete** - Remove tasks
7. **Logout** - Exit the application

## 🔒 Security

- Passwords hashed with bcrypt
- JWT tokens for authentication
- CORS enabled for frontend
- Environment variables for secrets
- MongoDB credentials secured

## 🐛 Troubleshooting

**CORS Error?**
- Check `FRONTEND_URL` in backend .env
- Ensure frontend and backend are running

**Login/Signup not working?**
- Verify MongoDB connection
- Check JWT_SECRET is set
- Look at browser console for errors

**Database connection failed?**
- Verify MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas
- Ensure credentials are correct

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📞 Support

For issues or questions, please create an issue on GitHub.

---

**Made with ❤️ using MERN Stack**
