import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  FiSave, FiTrash2, FiSearch, FiCalendar, FiBook, FiEdit2, 
  FiClock, FiEye, FiX, FiChevronRight 
} from 'react-icons/fi';
import { format, isToday, isYesterday, isThisWeek, parseISO, startOfDay } from 'date-fns';
import {
  fetchJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  setSearchTerm,
} from '../store/journalSlice';
import { addNotification } from '../store/uiSlice';

const JournalViewEnhanced = () => {
  const dispatch = useDispatch();
  const { entries, loading, searchTerm } = useSelector((state) => state.journal);
  const { theme } = useSelector((state) => state.ui);

  const [isWriting, setIsWriting] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'timeline', 'read'
  const [selectedEntry, setSelectedEntry] = useState(null);
  
  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [entryDate, setEntryDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [mood, setMood] = useState('');

  // Fetch all journal entries on mount
  useEffect(() => {
    dispatch(fetchJournalEntries({}));
  }, [dispatch]);

  const handleCreateEntry = async () => {
    console.log('🔔 handleCreateEntry called');
    console.log('📝 Title:', title);
    console.log('📄 Content length:', content.length);
    console.log('📅 Date:', entryDate);
    console.log('😊 Mood:', mood);
    
    if (!title.trim() || !content.trim()) {
      console.log('❌ Validation failed: Title or content empty');
      dispatch(
        addNotification({
          type: 'error',
          message: 'Title and content are required',
        })
      );
      return;
    }

    try {
      console.log('🚀 Attempting to save...');
      if (currentEntry) {
        console.log('✏️ Updating existing entry:', currentEntry._id);
        await dispatch(
          updateJournalEntry({
            id: currentEntry._id,
            updates: { title, content, entryDate, mood },
          })
        ).unwrap();

        dispatch(
          addNotification({
            type: 'success',
            message: 'Journal entry updated successfully!',
          })
        );
      } else {
        console.log('➕ Creating new entry');
        const result = await dispatch(
          createJournalEntry({
            title,
            content,
            entryDate,
            mood,
          })
        ).unwrap();
        console.log('✅ Entry created successfully:', result);

        dispatch(
          addNotification({
            type: 'success',
            message: 'Journal entry created successfully!',
          })
        );
      }

      resetForm();
      setIsWriting(false);
      setViewMode('list');
      
      // Refresh entries after save
      console.log('🔄 Refreshing entries...');
      dispatch(fetchJournalEntries({}));
    } catch (error) {
      console.error('❌ Save failed:', error);
      dispatch(
        addNotification({
          type: 'error',
          message: error || 'Failed to save journal entry',
        })
      );
    }
  };

  const handleDeleteEntry = async (id) => {
    if (!confirm('Are you sure you want to delete this journal entry?')) return;

    try {
      await dispatch(deleteJournalEntry(id)).unwrap();
      dispatch(
        addNotification({
          type: 'success',
          message: 'Journal entry deleted successfully!',
        })
      );
      if (selectedEntry?._id === id) {
        setSelectedEntry(null);
        setViewMode('list');
      }
    } catch (error) {
      dispatch(
        addNotification({
          type: 'error',
          message: error || 'Failed to delete journal entry',
        })
      );
    }
  };

  const handleEditEntry = (entry) => {
    setCurrentEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setEntryDate(format(new Date(entry.entryDate), 'yyyy-MM-dd'));
    setMood(entry.mood || '');
    setIsWriting(true);
    setViewMode('list');
  };

  const handleReadEntry = (entry) => {
    setSelectedEntry(entry);
    setViewMode('read');
  };

  const resetForm = () => {
    setCurrentEntry(null);
    setTitle('');
    setContent('');
    setEntryDate(format(new Date(), 'yyyy-MM-dd'));
    setMood('');
  };

  // Sort entries by entryDate descending (newest first)
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.entryDate) - new Date(a.entryDate)
  );

  // Filter entries based on search
  const filteredEntries = sortedEntries.filter((entry) => {
    if (searchTerm) {
      return (
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });

  // Group entries by date for timeline view
  const groupedEntries = filteredEntries.reduce((groups, entry) => {
    const date = format(new Date(entry.entryDate), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {});

  const getDateLabel = (dateString) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    if (isThisWeek(date)) return format(date, 'EEEE');
    return format(date, 'EEEE, MMMM dd, yyyy');
  };

  const moodEmojis = {
    great: '😄',
    good: '😊',
    okay: '😐',
    bad: '😞',
    terrible: '😢',
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      [{ color: [] }, { background: [] }],
      ['link'],
      ['clean'],
    ],
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className={`rounded-2xl p-6 shadow-xl transition-colors ${
        theme === 'dark'
          ? 'bg-slate-800/90 border border-slate-700'
          : 'bg-white border border-slate-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-900 dark:text-slate-100">
              <FiBook className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              My Diary
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'} • Track your daily thoughts
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'timeline' ? 'list' : 'timeline')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-purple-600 text-white'
                  : theme === 'dark'
                  ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
              }`}
            >
              <FiClock className="inline w-5 h-5 mr-2" />
              Timeline
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                resetForm();
                setIsWriting(!isWriting);
              }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg"
            >
              {isWriting ? '✕ Cancel' : '📝 New Entry'}
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <FiSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            placeholder="Search your diary..."
            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              theme === 'dark'
                ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500'
            }`}
          />
        </div>
      </div>

      {/* Journal Editor */}
      <AnimatePresence>
        {isWriting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`rounded-2xl p-6 shadow-xl transition-colors ${
              theme === 'dark'
                ? 'bg-slate-800/90 border border-slate-700'
                : 'bg-white border border-slate-200'
            }`}
          >
            <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
              {currentEntry ? '✏️ Edit Entry' : '📝 New Diary Entry'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  📌 Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your entry a title..."
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    📅 Date
                  </label>
                  <input
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      theme === 'dark'
                        ? 'bg-slate-700 border-slate-600 text-slate-100'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    😊 Mood
                  </label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      theme === 'dark'
                        ? 'bg-slate-700 border-slate-600 text-slate-100'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="">How are you feeling?</option>
                    <option value="great">😄 Great</option>
                    <option value="good">😊 Good</option>
                    <option value="okay">😐 Okay</option>
                    <option value="bad">😞 Bad</option>
                    <option value="terrible">😢 Terrible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  ✍️ Your Entry
                </label>
                <div className={`rounded-xl overflow-hidden border-2 transition-colors ${
                  theme === 'dark' 
                    ? 'quill-dark border-slate-600' 
                    : 'border-slate-200'
                }`}>
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    placeholder="Dear Diary, today I..."
                    className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
                    style={{ minHeight: '300px' }}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateEntry}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <FiSave className="w-5 h-5" />
                {currentEntry ? 'Update Entry' : '💾 Save to Diary'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Read-Only View */}
      <AnimatePresence>
        {viewMode === 'read' && selectedEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setSelectedEntry(null);
              setViewMode('list');
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-8 transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-800 border border-slate-700'
                  : 'bg-white border border-slate-200'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FiCalendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-lg font-semibold text-purple-700 dark:text-purple-400">
                      {format(new Date(selectedEntry.entryDate), 'EEEE, MMMM dd, yyyy')}
                    </span>
                    {selectedEntry.mood && (
                      <span className="text-2xl">{moodEmojis[selectedEntry.mood]}</span>
                    )}
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {selectedEntry.title}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setSelectedEntry(null);
                    setViewMode('list');
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-slate-700 text-slate-300'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div
                className={`prose max-w-none mb-6 transition-colors ${
                  theme === 'dark' 
                    ? 'prose-invert prose-slate' 
                    : 'prose-slate'
                }`}
                dangerouslySetInnerHTML={{ __html: selectedEntry.content }}
              />

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t transition-colors ${
                theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
              }">
                <button
                  onClick={() => handleEditEntry(selectedEntry)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  <FiEdit2 className="w-5 h-5" />
                  Edit Entry
                </button>
                <button
                  onClick={() => handleDeleteEntry(selectedEntry._id)}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Journal Entries */}
      <div className="space-y-6">
        {loading ? (
          <div className={`text-center py-16 rounded-2xl transition-colors ${
            theme === 'dark'
              ? 'bg-slate-800/90 border border-slate-700'
              : 'bg-white border border-slate-200'
          }`}>
            <div className="animate-pulse">
              <FiBook className="w-16 h-16 mx-auto text-purple-600 dark:text-purple-400 mb-4" />
              <p className="text-slate-900 dark:text-slate-100 text-lg font-medium">Loading your diary...</p>
            </div>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl transition-colors ${
            theme === 'dark'
              ? 'bg-slate-800/90 border border-slate-700'
              : 'bg-white border border-slate-200'
          }`}>
            <FiBook className="w-20 h-20 mx-auto text-purple-600 dark:text-purple-400 mb-4 opacity-50" />
            <p className="text-slate-900 dark:text-slate-100 text-xl font-semibold mb-2">
              {searchTerm ? 'No entries found' : 'Your diary awaits...'}
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-base mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Start documenting your thoughts and experiences'}
            </p>
          </div>
        ) : viewMode === 'timeline' ? (
          /* Timeline View */
          <div className="space-y-8">
            {Object.entries(groupedEntries).map(([date, dayEntries]) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {getDateLabel(date)}
                  </h3>
                  <div className="flex-1 h-px bg-slate-300 dark:bg-slate-700"></div>
                </div>
                <div className="space-y-4 pl-6 border-l-2 border-purple-600 dark:border-purple-400">
                  {dayEntries.map((entry) => (
                    <motion.div
                      key={entry._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`rounded-xl p-5 shadow-lg cursor-pointer transition-all hover:shadow-xl ${
                        theme === 'dark'
                          ? 'bg-slate-800/80 border border-slate-700 hover:border-purple-500'
                          : 'bg-white border border-slate-200 hover:border-purple-400'
                      }`}
                      onClick={() => handleReadEntry(entry)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                              {entry.title}
                            </h4>
                            {entry.mood && (
                              <span className="text-xl">{moodEmojis[entry.mood]}</span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                            {entry.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                          </p>
                        </div>
                        <FiChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          filteredEntries.map((entry) => (
            <motion.div
              key={entry._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-6 shadow-lg transition-all hover:shadow-2xl ${
                theme === 'dark'
                  ? 'bg-slate-800/90 border-2 border-slate-700 hover:border-purple-500'
                  : 'bg-white border-2 border-slate-200 hover:border-purple-400'
              }`}
            >
              <div className={`mb-4 pb-3 border-b-2 transition-colors ${
                theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiCalendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-lg font-semibold text-purple-700 dark:text-purple-400">
                      {format(new Date(entry.entryDate), 'EEEE, MMMM dd, yyyy')}
                    </span>
                    {entry.mood && (
                      <span className="text-2xl">{moodEmojis[entry.mood]}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                    {entry.title}
                  </h3>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleReadEntry(entry)}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'text-green-400 hover:bg-green-900/30'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title="Read entry"
                  >
                    <FiEye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEditEntry(entry)}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'text-blue-400 hover:bg-blue-900/30'
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                    title="Edit entry"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteEntry(entry._id)}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'text-red-400 hover:bg-red-900/30'
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                    title="Delete entry"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div
                className={`prose max-w-none transition-colors ${
                  theme === 'dark' ? 'prose-invert' : 'prose-slate'
                }`}
                style={{
                  color: theme === 'dark' ? '#cbd5e1' : '#334155',
                }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: entry.content.substring(0, 300) + (entry.content.length > 300 ? '...' : ''),
                  }}
                />
                {entry.content.length > 300 && (
                  <button
                    onClick={() => handleReadEntry(entry)}
                    className="mt-2 text-purple-600 dark:text-purple-400 hover:underline text-sm font-medium"
                  >
                    Read more →
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Custom Quill Dark Theme */}
      <style>{`
        .quill-dark .ql-toolbar {
          background: rgb(51 65 85);
          border-color: rgb(71 85 105) !important;
        }
        .quill-dark .ql-container {
          background: rgb(51 65 85);
          border-color: rgb(71 85 105) !important;
          color: white;
        }
        .quill-dark .ql-editor.ql-blank::before {
          color: rgb(148 163 184);
        }
        .quill-dark .ql-stroke {
          stroke: white !important;
        }
        .quill-dark .ql-fill {
          fill: white !important;
        }
        .quill-dark .ql-picker-label {
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default JournalViewEnhanced;
