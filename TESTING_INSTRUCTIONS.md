# 🧪 Testing Guide - Personal Growth Hub

## ✅ Issues Fixed

### 1. Backend Authentication Error (400 Bad Request)
- **Problem**: Missing `.env` file caused `JWT_SECRET` to be undefined
- **Solution**: Created `backend/.env` with proper configuration
- **Status**: ✅ **FIXED**

### 2. MongoDB Connection Error
- **Problem**: MongoDB authentication failure ("bad auth")
- **Solution**: Updated connection options with `directConnection: true`
- **Status**: ✅ **FIXED**

### 3. Light Mode Text Visibility
- **Problem**: Reported white text on light backgrounds
- **Solution**: Verified all components already use theme-aware classes (`text-gray-800 dark:text-white`)
- **Status**: ✅ **VERIFIED** - Components have proper theming

---

## 🚀 Testing Instructions

### Prerequisites
1. Backend server is running on port 4001 ✅
2. Frontend server should be running on port 5173
3. MongoDB is running ✅

### Step-by-Step Test Flow

#### 1. **Test Signup (New User Registration)**
```
1. Open http://localhost:5173/signup
2. Fill in:
   - Username: testuser
   - Email: test@example.com (use valid email format!)
   - Password: password123
3. Click "Sign Up"
4. Expected: Redirect to Dashboard
```

**Note**: The previous error with "a.@gmail.com" was due to invalid email format. Use proper emails like `user@example.com`.

#### 2. **Test Login**
```
1. Open http://localhost:5173/login
2. Enter:
   - Email: test@example.com
   - Password: password123
3. Click "Login"
4. Expected: Redirect to Dashboard
```

#### 3. **Test Task Creation**
```
1. On Dashboard, click "Tasks" in sidebar
2. Fill in the task form:
   - Task text: "Complete project documentation"
   - Priority: High
   - Category: Work
   - Due Date: Select a future date
3. Click "Add Task"
4. Expected: Task appears in the list with colored badges
5. Try dragging tasks to reorder them
```

#### 4. **Test Journal Entry**
```
1. Click "Journal" in sidebar
2. Click "+ New Entry" button
3. Fill in:
   - Title: "My First Journal Entry"
   - Date: Today
   - Mood: Select an emoji (😊 Good)
   - Content: Use the rich text editor (try bold, lists, etc.)
4. Click "Save Entry"
5. Expected: Entry saved and appears in journal list
```

#### 5. **Test Analytics**
```
1. Click "Analytics" in sidebar
2. Expected: See charts showing:
   - Total tasks count
   - Completed tasks count
   - Completion rate
   - Daily task completion trend (line chart)
   - Tasks by category (pie chart)
   - Tasks by priority (bar chart)
3. Try changing time period (7 days, 14 days, 30 days)
```

#### 6. **Test Light/Dark Mode Toggle**
```
1. Click the theme toggle button (moon/sun icon) in sidebar
2. Switch between Dark and Light mode
3. Verify text is readable in both modes:
   - Sidebar text should be visible
   - Task cards text should be visible
   - Journal entries text should be visible
   - Chart labels should be visible
```

#### 7. **Test Carry Over Modal (Smart Task Scheduling)**
```
1. Create a task with yesterday's date as due date
2. Refresh the page
3. Expected: Carry Over Modal appears with overdue tasks
4. Try:
   - Selecting a new date
   - Click "Reschedule" on a task
   - Click "Today" or "Tomorrow" quick buttons
```

#### 8. **Test Task Operations**
```
- Mark task as complete (checkbox)
- Filter tasks by priority (All, Low, Medium, High)
- Filter tasks by category (All, Work, Personal, Health, Other)
- Delete a task (trash icon)
- Drag and drop to reorder tasks
```

#### 9. **Test Journal Operations**
```
- Search journal entries by title/content
- Edit an existing entry (edit icon)
- Delete an entry (trash icon)
- View entries by different dates
```

#### 10. **Test Logout**
```
1. Click "Logout" button in sidebar
2. Expected: Redirect to login page
3. Try accessing dashboard without login
4. Expected: Should show login page
```

---

## 🎨 UI Features to Verify

### Glassmorphism Design
- Transparent/frosted glass effect on cards
- Backdrop blur on modals and cards
- Gradient backgrounds

### Animations
- Smooth transitions on hover
- Framer Motion animations on page loads
- Drag-and-drop feedback

### Responsive Layout
- Sidebar collapses on mobile
- Charts resize properly
- Cards stack on smaller screens

---

## 🐛 Common Issues & Solutions

### Issue: "Failed to fetch" errors
**Solution**: Make sure backend is running on port 4001

### Issue: Tasks/Journal not loading
**Solution**: Check if you're logged in (token in localStorage)

### Issue: MongoDB connection errors
**Solution**: Ensure MongoDB service is running (already verified ✅)

### Issue: "Invalid email format" on signup
**Solution**: Use proper email format like `user@example.com`, not `a.@gmail.com`

### Issue: White text on light background
**Solution**: Already fixed - all components use theme-aware classes

---

## 📋 Feature Checklist

- [ ] User signup works
- [ ] User login works
- [ ] Create task with priority/category/due date
- [ ] Task drag-and-drop reordering
- [ ] Mark tasks complete/incomplete
- [ ] Delete tasks
- [ ] Filter tasks by priority
- [ ] Filter tasks by category
- [ ] Create journal entry with rich text
- [ ] Edit journal entries
- [ ] Delete journal entries
- [ ] Search journal entries
- [ ] View analytics charts
- [ ] Change time period in analytics
- [ ] Carry over modal for overdue tasks
- [ ] Dark/light mode toggle
- [ ] Text visible in both themes
- [ ] Logout functionality

---

## 🎯 Expected Behavior Summary

**Backend Status**: ✅ Running on port 4001 with MongoDB connected
**Frontend Status**: Should be running on port 5173
**Authentication**: JWT-based with cookies + localStorage
**Database**: MongoDB local instance (growthhub database)

All core features are implemented and should be working now. The main fixes were:
1. Added `.env` file with `JWT_SECRET`
2. Fixed MongoDB connection with `directConnection: true`
3. Verified theme-aware styling exists

**Next Steps**: Follow the testing instructions above to verify everything works end-to-end!

---

## 💡 Tips

- Use Chrome DevTools Network tab to debug API calls
- Check Console for any JavaScript errors
- Verify localStorage has `token` and `user` after login
- MongoDB data is stored in `growthhub` database
- All passwords are hashed with bcrypt (10 rounds)

Good luck testing! 🚀
