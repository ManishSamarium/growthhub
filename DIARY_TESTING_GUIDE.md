# 📔 Diary Testing Guide

## ✅ How to Test Your Diary

### Step 1: Open the Diary Section
1. Go to http://localhost:5173
2. Login if not already logged in
3. Click on **"Journal"** in the left sidebar

### Step 2: Create a New Diary Entry
1. In the **Title** field, type: `My First Diary Entry`
2. In the **Your Diary Entry** field, type: `Today was a wonderful day. I learned a lot and felt very productive!`
3. Click the big purple **"Save Diary Entry"** button

### Step 3: Verify Entry is Saved
✅ You should see:
- A success notification: "Diary entry saved successfully!"
- Your entry appears below the form
- The title "My First Diary Entry" in bold
- The date showing: "Tuesday, January 14, 2026"
- The time showing when you saved it (e.g., "3:45 PM")
- Your full diary content displayed
- An Edit button (blue pencil icon)
- A Delete button (red trash icon)

### Step 4: Test Editing
1. Click the **blue pencil icon** (Edit button) on your entry
2. The form at the top fills with your entry
3. Change the title or content
4. Click **"Update Diary Entry"**
5. Your changes appear immediately

### Step 5: Test Creating Another Entry
1. The form is now empty
2. Add a new title: `Second Entry`
3. Add content: `This is my second diary entry!`
4. Click **"Save Diary Entry"**
5. The new entry appears at the top (most recent first)

### Step 6: Test Deleting
1. Click the **red trash icon** (Delete button) on any entry
2. Confirm the deletion
3. The entry disappears

## 🎯 What You Should See

### When Saved:
- ✅ Title displayed in large bold text
- ✅ Date in format: "Tuesday, January 14, 2026"
- ✅ Time in format: "3:45 PM"
- ✅ Full diary content
- ✅ Edit button (pencil icon)
- ✅ Delete button (trash icon)

### Entry Count:
- Shows "0 entries saved" when empty
- Shows "1 entry saved" with one entry
- Shows "2 entries saved" with two entries

## 🔍 Troubleshooting

### If entries don't appear:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Check for any red error messages
4. Try refreshing the page

### If save button doesn't work:
1. Make sure you filled both Title AND Content
2. Check if you're logged in (check top-left corner)
3. Verify backend is running on port 4001

### To verify backend is saving:
Open a PowerShell terminal and run:
```powershell
Get-NetTCPConnection -LocalPort 4001 | Select-Object State
```
Should show "Listen"

## ✨ Features Working:
- ✅ Save Diary Entry button
- ✅ Shows title with entry
- ✅ Shows date and time
- ✅ Edit functionality with pencil icon
- ✅ Delete functionality with trash icon
- ✅ Entries sorted by newest first
- ✅ Success notifications on save/update/delete
- ✅ Form validation (requires title and content)
- ✅ Form clears after saving
- ✅ Smooth animations
- ✅ Dark mode support
