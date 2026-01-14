# Testing Journal Save Functionality

## Steps to Test:

### 1. Check if servers are running:
- Backend should be on http://localhost:4001
- Frontend should be on http://localhost:5173

### 2. Open Browser Console:
- Open your app at http://localhost:5173
- Open DevTools (F12)
- Go to Console tab

### 3. Try creating a journal entry:
- Click "📝 New Entry" button
- Fill in:
  - Title: "Test Entry"
  - Date: Today's date
  - Mood: Any mood
  - Content: "This is a test diary entry"
- Click "💾 Save to Diary" button

### 4. Check Console Logs:
You should see detailed logs like:
```
🔔 handleCreateEntry called
📝 Title: Test Entry
📄 Content length: 28
📅 Date: 2025-01-10
😊 Mood: good
🚀 Attempting to save...
➕ Creating new entry
📡 API Call - Creating journal entry: {title: "Test Entry", content: "This is a test diary entry", ...}
🌐 API URL: http://localhost:4001/journal/create
✅ API Response: {...}
✅ Entry created successfully: {...}
🔄 Refreshing entries...
```

### 5. Check Network Tab:
- Go to Network tab in DevTools
- Look for a POST request to `/journal/create`
- Status should be 201 (Created)
- Response should contain the saved journal entry

### 6. Check Backend Terminal:
You should see logs like:
```
📥 Received journal create request
👤 User ID: 507f1f77bcf86cd799439011
📝 Request body: { title: 'Test Entry', content: '...', ... }
💾 Saving journal entry...
✅ Journal entry saved successfully: 507f191e810c19729de860ea
```

## Common Issues:

### If you see "401 Unauthorized":
- You're not logged in
- Clear cookies and login again

### If you see "Title and content are required":
- The form fields are empty
- Check that you filled both title and content

### If you see "Failed to save journal entry":
- Check backend terminal for errors
- Verify MongoDB is running
- Check database connection string

### If entries don't appear after saving:
- Check the fetchJournalEntries is being called
- Verify the Redux state is updating
- Check for any filter/search that might hide entries

## Debugging Commands:

Check if MongoDB is connected:
```bash
cd backend
node -e "import('mongoose').then(m => m.default.connect('mongodb://127.0.0.1:27017/growthhub', {directConnection: true}).then(() => console.log('✅ Connected')).catch(e => console.error('❌', e)))"
```

Query all journal entries directly:
```bash
mongosh growthhub --eval "db.journals.find().pretty()"
```
