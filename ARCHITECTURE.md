# 🏗️ Component Architecture

## Component Hierarchy

```
App (Routes)
│
├── Login
│   └── Form + Authentication Logic
│
├── Signup  
│   └── Form + Registration Logic
│
└── Dashboard (Main Layout)
    │
    ├── Sidebar
    │   ├── Navigation Menu
    │   │   ├── Tasks Button
    │   │   ├── Journal Button
    │   │   └── Analytics Button
    │   ├── Theme Toggle
    │   └── Logout Button
    │
    ├── TopBar
    │   ├── Menu Toggle
    │   ├── View Title
    │   └── Overdue Tasks Badge
    │
    ├── View Router
    │   │
    │   ├── TaskView
    │   │   ├── Task Creation Form
    │   │   │   ├── Text Input
    │   │   │   ├── Priority Selector
    │   │   │   ├── Category Selector
    │   │   │   └── Date Picker
    │   │   │
    │   │   ├── Filter Bar
    │   │   │   ├── Category Filter
    │   │   │   └── Priority Filter
    │   │   │
    │   │   └── Task List (DragDropContext)
    │   │       └── Droppable
    │   │           └── Task Items (Draggable)
    │   │               ├── Checkbox
    │   │               ├── Task Text
    │   │               ├── Priority Badge
    │   │               ├── Category Badge
    │   │               ├── Due Date
    │   │               └── Delete Button
    │   │
    │   ├── JournalView
    │   │   ├── Header
    │   │   │   ├── Search Bar
    │   │   │   └── New Entry Button
    │   │   │
    │   │   ├── Journal Editor (Conditional)
    │   │   │   ├── Title Input
    │   │   │   ├── Date Picker
    │   │   │   ├── Mood Selector
    │   │   │   ├── Rich Text Editor (React-Quill)
    │   │   │   └── Save Button
    │   │   │
    │   │   └── Journal Entries List
    │   │       └── Entry Cards
    │   │           ├── Title
    │   │           ├── Date & Mood
    │   │           ├── Content Preview
    │   │           ├── Edit Button
    │   │           └── Delete Button
    │   │
    │   └── AnalyticsView
    │       ├── Stats Cards Row
    │       │   ├── Total Tasks Card
    │       │   ├── Completed Card
    │       │   ├── Completion Rate Card
    │       │   └── In Progress Card
    │       │
    │       ├── Time Period Selector
    │       │   ├── 7 Days Button
    │       │   ├── 14 Days Button
    │       │   └── 30 Days Button
    │       │
    │       └── Charts Grid
    │           ├── Daily Completion (Line Chart)
    │           ├── Category Distribution (Pie Chart)
    │           ├── Priority Breakdown (Bar Chart)
    │           └── Category Progress (Horizontal Bar)
    │
    └── CarryOverModal (Conditional)
        ├── Header
        ├── Date Selector
        │   ├── Date Picker
        │   ├── Today Button
        │   └── Tomorrow Button
        └── Overdue Tasks List
            └── Task Cards
                ├── Task Details
                ├── Reschedule Button
                └── Dismiss Button
```

## State Management Structure

```
Redux Store
│
├── tasks (taskSlice)
│   ├── State:
│   │   ├── items: Task[]
│   │   ├── overdueTasks: Task[]
│   │   ├── analytics: AnalyticsData
│   │   ├── loading: boolean
│   │   ├── error: string | null
│   │   └── filters: { category, priority, searchTerm }
│   │
│   └── Actions (Async Thunks):
│       ├── fetchTasks
│       ├── createTask
│       ├── updateTask
│       ├── deleteTask
│       ├── fetchOverdueTasks
│       ├── carryOverTask
│       ├── reorderTasks
│       └── fetchAnalytics
│
├── journal (journalSlice)
│   ├── State:
│   │   ├── entries: JournalEntry[]
│   │   ├── currentEntry: JournalEntry | null
│   │   ├── loading: boolean
│   │   ├── error: string | null
│   │   └── searchTerm: string
│   │
│   └── Actions (Async Thunks):
│       ├── fetchJournalEntries
│       ├── createJournalEntry
│       ├── updateJournalEntry
│       ├── deleteJournalEntry
│       └── fetchJournalEntryById
│
└── ui (uiSlice)
    ├── State:
    │   ├── theme: 'light' | 'dark'
    │   ├── sidebarOpen: boolean
    │   ├── activeView: 'tasks' | 'journal' | 'analytics'
    │   ├── showCarryOverModal: boolean
    │   └── notifications: Notification[]
    │
    └── Actions (Synchronous):
        ├── toggleTheme
        ├── setTheme
        ├── toggleSidebar
        ├── setSidebarOpen
        ├── setActiveView
        ├── setShowCarryOverModal
        ├── addNotification
        ├── removeNotification
        └── clearNotifications
```

## Data Flow Patterns

### 1. Task Creation Flow
```
User Input (TaskView)
    ↓
dispatch(createTask(taskData))
    ↓
Async Thunk → API Call
    ↓
POST /todo/create
    ↓
Backend Controller
    ↓
MongoDB Save
    ↓
Response
    ↓
Redux State Update
    ↓
UI Re-render (new task appears)
```

### 2. Drag-and-Drop Flow
```
User Drags Task
    ↓
onDragEnd Handler
    ↓
Local State Update (immediate)
    ↓
dispatch(reorderTasks(updates))
    ↓
POST /todo/reorder
    ↓
Backend Updates Orders
    ↓
Response
    ↓
Confirmed in Redux
```

### 3. Carry-Over Flow
```
Page Load / Midnight Check
    ↓
dispatch(fetchOverdueTasks())
    ↓
GET /todo/overdue
    ↓
Backend Finds Past-Due Tasks
    ↓
Tasks Stored in Redux
    ↓
CarryOverModal Appears (if tasks exist)
    ↓
User Reschedules
    ↓
dispatch(carryOverTask({ id, newDueDate }))
    ↓
PUT /todo/carry-over/:id
    ↓
Task Updated
    ↓
Modal Updates / Closes
```

### 4. Analytics Flow
```
User Opens Analytics Tab
    ↓
dispatch(fetchAnalytics(days))
    ↓
GET /todo/analytics?days=7
    ↓
Backend Aggregates Data
    ↓
Response with Stats
    ↓
Redux State Update
    ↓
Charts Render with Data
```

### 5. Theme Toggle Flow
```
User Clicks Theme Button
    ↓
dispatch(toggleTheme())
    ↓
Redux State: theme = 'dark' | 'light'
    ↓
useEffect Hook Detects Change
    ↓
document.documentElement.classList.toggle('dark')
    ↓
localStorage.setItem('theme', newTheme)
    ↓
All Components Re-render with New Theme
```

## API Integration Pattern

```javascript
// In Component
const dispatch = useDispatch();
const { items, loading, error } = useSelector(state => state.tasks);

useEffect(() => {
  dispatch(fetchTasks({ category: 'all', priority: 'all' }));
}, [dispatch]);

// In Slice (taskSlice.js)
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/todo/fetch`, {
        params: filters,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Reducer
extraReducers: (builder) => {
  builder
    .addCase(fetchTasks.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchTasks.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    })
    .addCase(fetchTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
}
```

## Component Communication

### Parent → Child (Props)
```javascript
<TaskView />
  └── passes: theme, onTaskClick, filters
      └── <TaskItem task={task} theme={theme} onClick={onTaskClick} />
```

### Child → Parent (Callbacks)
```javascript
<TaskItem 
  task={task}
  onDelete={(id) => dispatch(deleteTask(id))}
  onToggle={(id) => dispatch(updateTask({ id, updates: {...} }))}
/>
```

### Sibling → Sibling (Redux)
```javascript
Component A: dispatch(setActiveView('journal'))
    ↓ Redux Store ↓
Component B: const { activeView } = useSelector(state => state.ui)
```

## Styling Architecture

### Tailwind Utility Classes
```
- Layout: flex, grid, container
- Spacing: p-*, m-*, gap-*
- Colors: bg-*, text-*, border-*
- Effects: shadow-*, backdrop-blur-*
- Responsive: sm:, md:, lg:, xl:
- Dark Mode: dark:bg-*, dark:text-*
```

### Glassmorphism Pattern
```javascript
className={`
  ${theme === 'dark' 
    ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700'
    : 'bg-white/70 backdrop-blur-xl border border-white/20'
  }
  rounded-2xl p-6 shadow-xl
`}
```

### Animation Pattern (Framer Motion)
```javascript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {content}
</motion.div>
```

## Performance Considerations

### Optimization Techniques
1. **Redux Selectors**: Use memoized selectors
2. **React.memo**: Wrap expensive components
3. **useCallback**: Memoize callback functions
4. **useMemo**: Memoize computed values
5. **Code Splitting**: Lazy load routes
6. **Debouncing**: Search inputs
7. **Virtualization**: Large lists (future)

### Bundle Optimization
- Vite's automatic code splitting
- Tree shaking for unused code
- Dynamic imports for routes
- Recharts loaded only in Analytics

## Security Layers

```
User Request
    ↓
Frontend (JWT in cookies)
    ↓
API Request with credentials: true
    ↓
Backend: verifyToken Middleware
    ↓
JWT Verification
    ↓
req.userId attached
    ↓
Controller checks userId
    ↓
Database query with userId filter
    ↓
Response (user-specific data only)
```

## Error Handling Strategy

```
Try/Catch in Async Thunks
    ↓
rejectWithValue(error.message)
    ↓
Redux State: error = message
    ↓
Component: useSelector(state => state.tasks.error)
    ↓
Display Error UI / Notification
    ↓
User Action / Timeout
    ↓
dispatch(clearError())
```

---

This architecture ensures:
- ✅ Scalable component structure
- ✅ Centralized state management
- ✅ Clean separation of concerns
- ✅ Predictable data flow
- ✅ Maintainable codebase
- ✅ Optimized performance
