# � Advanced Personal Growth Hub

**Transform your productivity with an all-in-one personal growth platform!**

A comprehensive MERN stack application featuring advanced task management, daily journaling, and powerful analytics - all wrapped in a beautiful glassmorphism UI.

## ✨ Features

### 📋 Advanced Task Management
- ✅ **Smart Task Scheduling** - Priority levels (Low, Medium, High)
- 🏷️ **Categories** - Work, Personal, Health, and more
- 📅 **Due Dates** - Never miss a deadline
- 🔄 **Carry-Over System** - Automatic overdue task handling
- 🎯 **Drag-and-Drop** - Reorder tasks intuitively
- 🔍 **Smart Filters** - Filter by category and priority

### ✍️ Daily Journaling
- 📝 **Rich Text Editor** - Format your thoughts beautifully
- 😊 **Mood Tracking** - Track emotional patterns
- 🔍 **Search** - Find entries instantly
- 📆 **Date-Based Organization** - Browse by day, month, or year
- 🏷️ **Tags** - Organize journal entries

### 📊 Task Analytics
- 📈 **Completion Trends** - Visual progress tracking
- 🥧 **Category Distribution** - See where your time goes
- 📊 **Priority Breakdown** - Understand your focus areas
- 📅 **Time Periods** - View 7, 14, or 30-day trends
- 🎯 **Completion Rates** - Track productivity percentage

### 🎨 Modern UI/UX
- 🌈 **Glassmorphism Design** - Translucent, modern aesthetics
- 🌙 **Dark/Light Mode** - Easy on the eyes, day or night
- ✨ **Smooth Animations** - Powered by Framer Motion
- 📱 **Fully Responsive** - Perfect on all devices
- 🎭 **Color-Coded System** - Visual priority and category indicators

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite
- **Redux Toolkit** - State management
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations
- **React-Quill** - Rich text editor
- **@hello-pangea/dnd** - Drag and drop
- **Recharts** - Data visualization
- **React Router v7** - Navigation
- **Date-fns** - Date utilities

### Backend
- **Node.js** with Express 5
- **MongoDB** with Mongoose
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin support

### Database
- MongoDB Atlas (Cloud)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/TodoApp.git
   cd TodoApp
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   echo "PORT=4001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key_here" > .env
   
   # Start backend server
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install --legacy-peer-deps
   
   # Create .env file
   echo "VITE_API_URL=http://localhost:4001" > .env
   
   # Start development server
   npm run dev
   ```

4. **Access the app**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4001

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=4001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/growthhub
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:4001
```

## 📚 API Documentation

### Authentication Endpoints
```
POST   /user/signup          Register new user
POST   /user/login           Login user
POST   /user/logout          Logout user
```

### Task Endpoints
```
POST   /todo/create          Create new task
GET    /todo/fetch           Get all tasks (supports filters)
PUT    /todo/update/:id      Update task
DELETE /todo/delete/:id      Delete task
GET    /todo/overdue         Get overdue tasks
PUT    /todo/carry-over/:id  Carry over overdue task
POST   /todo/reorder         Update task order (drag-drop)
GET    /todo/analytics       Get task analytics
```

### Journal Endpoints
```
POST   /journal/create       Create journal entry
GET    /journal/fetch        Get all entries (supports search)
GET    /journal/:id          Get single entry
PUT    /journal/update/:id   Update entry
DELETE /journal/delete/:id   Delete entry
GET    /journal/month        Get entries by month
```

## 🎯 Usage Guide

### Getting Started
1. **Sign Up** - Create your account
2. **Login** - Access your dashboard
3. **Explore** - Navigate between Tasks, Journal, and Analytics

### Task Management
- **Create**: Fill in task details (text, priority, category, due date)
- **Complete**: Check the checkbox when done
- **Reorder**: Drag and drop to prioritize
- **Filter**: Use category/priority filters
- **Carry Over**: Reschedule overdue tasks

### Journaling
- **New Entry**: Click "+ New Entry"
- **Format**: Use the rich text toolbar
- **Mood**: Select your current mood
- **Search**: Find past entries instantly
- **Edit**: Click the save icon on any entry

### Analytics
- **View Stats**: See completion rates and trends
- **Time Period**: Select 7, 14, or 30 days
- **Charts**: Hover for detailed information
- **Categories**: Track time distribution

## 📂 Project Structure

```
TodoApp/
├── backend/
│   ├── controller/
│   │   ├── todo.control.js      # Task logic + analytics
│   │   ├── journal.control.js   # Journal CRUD
│   │   └── user.control.js      # Authentication
│   ├── model/
│   │   ├── todo.model.js        # Task schema
│   │   ├── journal.model.js     # Journal schema
│   │   └── user.model.js        # User schema
│   ├── route/
│   │   ├── todo.rout.js         # Task routes
│   │   ├── journal.rout.js      # Journal routes
│   │   └── user.rout.js         # Auth routes
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   └── index.js                 # Server entry
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx         # Main layout
│   │   │   ├── TaskView.jsx          # Task interface
│   │   │   ├── JournalView.jsx       # Journal interface
│   │   │   ├── AnalyticsView.jsx     # Analytics charts
│   │   │   ├── CarryOverModal.jsx    # Overdue tasks
│   │   │   ├── Login.jsx             # Auth
│   │   │   └── Signup.jsx            # Registration
│   │   ├── store/
│   │   │   ├── store.js              # Redux config
│   │   │   ├── taskSlice.js          # Task state
│   │   │   ├── journalSlice.js       # Journal state
│   │   │   └── uiSlice.js            # UI state
│   │   ├── App.jsx                   # Routes
│   │   └── main.jsx                  # Entry point
│   └── package.json
│
├── IMPLEMENTATION_GUIDE.md    # Detailed technical docs
├── QUICK_START.md            # User guide
├── SUMMARY.md                # Feature overview
├── TESTING_CHECKLIST.md      # QA checklist
└── README.md                 # This file
```

## 🎨 Screenshots

### Dashboard - Light Mode
Beautiful glassmorphism design with intuitive navigation

### Task Management
Drag-and-drop interface with color-coded priorities

### Journal Editor
Rich text editing with mood tracking

### Analytics Dashboard
Interactive charts showing productivity trends

## 🔧 Development

### Backend Development
```bash
cd backend
npm run start     # Uses nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev       # Vite dev server with HMR
npm run build     # Production build
npm run preview   # Preview production build
```

### Database Schema

**Task Schema**
```javascript
{
  userId: ObjectId,
  text: String,
  completed: Boolean,
  priority: 'low' | 'medium' | 'high',
  category: 'work' | 'personal' | 'health' | 'other',
  dueDate: Date,
  isCarriedOver: Boolean,
  order: Number
}
```

**Journal Schema**
```javascript
{
  userId: ObjectId,
  title: String,
  content: String (HTML),
  entryDate: Date,
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible',
  tags: [String]
}
```

## 🚀 Deployment

### Backend (Railway/Render/Heroku)
1. Connect repository
2. Set environment variables
3. Deploy from main branch

### Frontend (Vercel/Netlify)
1. Connect repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables
5. Deploy

### Database
- Use MongoDB Atlas (already cloud-hosted)
- Whitelist deployment server IPs

## 🐛 Troubleshooting

**Issue: Dependencies won't install**
```bash
npm install --legacy-peer-deps
```

**Issue: Authentication fails**
- Clear localStorage and cookies
- Verify JWT_SECRET matches
- Check backend is running

**Issue: Charts not showing**
- Create some tasks first
- Check browser console for errors
- Verify Recharts is installed

See [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) for comprehensive troubleshooting.

## 📖 Documentation

- **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Comprehensive technical documentation
- **[QUICK_START.md](QUICK_START.md)** - User-friendly getting started guide
- **[SUMMARY.md](SUMMARY.md)** - Feature overview and architecture
- **[TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)** - QA and testing protocols

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for utility-first styling
- Framer Motion for smooth animations
- MongoDB for flexible database
- All open-source contributors

## 📞 Support

If you have questions or need help:
- Check the [documentation files](.)
- Open an issue on GitHub
- Review the [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)

## 🎯 Future Roadmap

- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Recurring tasks
- [ ] Calendar integration
- [ ] Collaborative features
- [ ] AI-powered suggestions
- [ ] Export to PDF
- [ ] Voice input
- [ ] Habit tracking
- [ ] Goal setting module

---

**Built with ❤️ using the MERN stack**

*Making personal growth trackable, one task at a time.* 🚀

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
