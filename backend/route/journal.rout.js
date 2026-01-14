import express from 'express';
import { 
    createJournalEntry, 
    getJournalEntries, 
    getJournalEntryById,
    updateJournalEntry, 
    deleteJournalEntry,
    getJournalEntriesByMonth 
} from '../controller/journal.control.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', verifyToken, createJournalEntry);
router.get('/fetch', verifyToken, getJournalEntries); // Supports query params: startDate, endDate, search, limit, sortBy, order
router.get('/month', verifyToken, getJournalEntriesByMonth);
router.get('/:id', verifyToken, getJournalEntryById);
router.put('/update/:id', verifyToken, updateJournalEntry);
router.delete('/delete/:id', verifyToken, deleteJournalEntry);

export default router;
