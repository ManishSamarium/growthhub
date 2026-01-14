import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiBook, FiCalendar, FiEdit2, FiTrash2, FiSave } from 'react-icons/fi';
import { format } from 'date-fns';
import {
  fetchJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from '../store/journalSlice';
import { addNotification } from '../store/uiSlice';

const JournalView = () => {
  const dispatch = useDispatch();
  const { entries, loading } = useSelector((state) => state.journal);
  const { theme } = useSelector((state) => state.ui);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchJournalEntries({}));
  }, [dispatch]);

  const handleSaveDiaryEntry = async () => {
    console.log('🔥 SAVE BUTTON CLICKED!');
    console.log('Title:', title);
    console.log('Content:', content);
    
    if (!title.trim()) {
      console.log('❌ No title');
      alert('Please enter a title for your diary entry');
      return;
    }

    if (!content.trim()) {
      console.log('❌ No content');
      alert('Please write something in your diary');
      return;
    }

    console.log('✅ Validation passed, saving...');

    try {
      if (editingId) {
        console.log('Updating entry:', editingId);
        const result = await dispatch(
          updateJournalEntry({
            id: editingId,
            updates: { title, content },
          })
        ).unwrap();
        console.log('✅ Update result:', result);
        alert('Diary entry updated successfully!');
      } else {
        console.log('Creating new entry...');
        const result = await dispatch(
          createJournalEntry({
            title: title.trim(),
            content: content.trim(),
            entryDate: new Date().toISOString(),
          })
        ).unwrap();
        console.log('✅ Create result:', result);
        alert('Diary entry saved successfully!');
      }

      // Clear form
      setTitle('');
      setContent('');
      setEditingId(null);

      // Refresh entries
      console.log('🔄 Refreshing entries...');
      await dispatch(fetchJournalEntries({}));
      console.log('✅ Entries refreshed');
    } catch (error) {
      console.error('❌ ERROR:', error);
      alert('Failed to save: ' + (error.message || error));
    }
  };

  const handleEdit = (entry) => {
    setTitle(entry.title);
    setContent(entry.content);
    setEditingId(entry._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this diary entry?')) return;

    try {
      await dispatch(deleteJournalEntry(id)).unwrap();
      dispatch(addNotification({
        type: 'success',
        message: 'Diary entry deleted successfully!',
      }));
      dispatch(fetchJournalEntries({}));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to delete diary entry',
      }));
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className={`rounded-2xl p-6 shadow-lg ${
        theme === 'dark'
          ? 'bg-slate-800 border border-slate-700'
          : 'bg-white border border-slate-200'
      }`}>
        <div className="flex items-center gap-3 mb-2">
          <FiBook className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
            My Diary
          </h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'} saved
        </p>
      </div>

      {/* Diary Entry Form */}
      <div className={`rounded-2xl p-6 shadow-lg ${
        theme === 'dark'
          ? 'bg-slate-800 border border-slate-700'
          : 'bg-white border border-slate-200'
      }`}>
        <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">
          {editingId ? '✏️ Edit Entry' : '📝 Write New Entry'}
        </h3>

        <div className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-slate-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your diary entry..."
              className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400'
                  : 'bg-white border-slate-300 text-gray-900 placeholder-slate-500'
              }`}
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-slate-300 mb-2">
              Your Diary Entry
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Dear Diary, today..."
              rows={8}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${
                theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400'
                  : 'bg-white border-slate-300 text-gray-900 placeholder-slate-500'
              }`}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveDiaryEntry}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg"
            >
              <FiSave className="w-6 h-6" />
              {editingId ? 'Update Diary Entry' : 'Save Diary Entry'}
            </motion.button>

            {editingId && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancel}
                className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                    : 'bg-slate-200 text-gray-900 hover:bg-slate-300'
                }`}
              >
                Cancel
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Saved Diary Entries */}
      <div className="space-y-4">
        {loading ? (
          <div className={`text-center py-16 rounded-2xl ${
            theme === 'dark'
              ? 'bg-slate-800 border border-slate-700'
              : 'bg-white border border-slate-200'
          }`}>
            <div className="animate-pulse">
              <FiBook className="w-16 h-16 mx-auto text-purple-600 dark:text-purple-400 mb-4" />
              <p className="text-gray-900 dark:text-slate-100 text-lg font-medium">
                Loading your diary...
              </p>
            </div>
          </div>
        ) : entries.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl ${
            theme === 'dark'
              ? 'bg-slate-800 border border-slate-700'
              : 'bg-white border border-slate-200'
          }`}>
            <FiBook className="w-20 h-20 mx-auto text-purple-600 dark:text-purple-400 mb-4 opacity-50" />
            <p className="text-gray-900 dark:text-slate-100 text-xl font-semibold mb-2">
              No diary entries yet
            </p>
            <p className="text-gray-700 dark:text-slate-400 text-base">
              Start writing your first diary entry above!
            </p>
          </div>
        ) : (
          entries.map((entry) => (
            <motion.div
              key={entry._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-6 shadow-lg transition-all hover:shadow-xl ${
                theme === 'dark'
                  ? 'bg-slate-800 border border-slate-700'
                  : 'bg-white border border-slate-200'
              }`}
            >
              {/* Entry Header */}
              <div className="flex items-start justify-between mb-4 pb-3 border-b-2 border-slate-200 dark:border-slate-700">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                    {entry.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <FiCalendar className="w-4 h-4" />
                    <span className="font-medium">
                      {format(new Date(entry.entryDate || entry.createdAt), 'EEEE, MMMM dd, yyyy')}
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                      {format(new Date(entry.createdAt), 'h:mm a')}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(entry)}
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
                    onClick={() => handleDelete(entry._id)}
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

              {/* Entry Content */}
              <div className="text-gray-800 dark:text-slate-300 whitespace-pre-wrap">
                {entry.content}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default JournalView;
