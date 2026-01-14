import Journal from "../model/journal.model.js";

// Create a new journal entry
export const createJournalEntry = async (req, res) => {
    try {
        console.log('📥 Received journal create request');
        console.log('👤 User ID:', req.userId);
        console.log('📝 Request body:', req.body);
        
        const { title, content, entryDate, mood, tags } = req.body;
        const userId = req.userId; // Changed from req.user.id

        if (!title || !content) {
            console.log('❌ Validation failed: Missing title or content');
            return res.status(400).json({ 
                message: "Title and content are required" 
            });
        }

        const journal = new Journal({
            userId,
            title,
            content,
            entryDate: entryDate || new Date(),
            mood,
            tags: tags || []
        });

        console.log('💾 Saving journal entry...');
        await journal.save();
        console.log('✅ Journal entry saved successfully:', journal._id);
        
        res.status(201).json(journal);
    } catch (error) {
        console.error("❌ Error creating journal entry:", error);
        res.status(500).json({ 
            message: "Failed to create journal entry",
            error: error.message 
        });
    }
};

// Get all journal entries for a user
export const getJournalEntries = async (req, res) => {
    try {
        const userId = req.userId;
        const { startDate, endDate, search, limit = 100, sortBy = 'createdAt', order = 'desc' } = req.query;

        let query = { userId };

        // Filter by date range
        if (startDate || endDate) {
            query.entryDate = {};
            if (startDate) query.entryDate.$gte = new Date(startDate);
            if (endDate) query.entryDate.$lte = new Date(endDate);
        }

        // Determine sort order
        const sortOrder = order === 'asc' ? 1 : -1;
        const sortField = sortBy === 'entryDate' ? 'entryDate' : 'createdAt';

        let journals = await Journal.find(query)
            .sort({ [sortField]: sortOrder })
            .limit(parseInt(limit))
            .lean();

        // Search in title and content
        if (search) {
            const searchLower = search.toLowerCase();
            journals = journals.filter(journal => 
                journal.title.toLowerCase().includes(searchLower) ||
                journal.content.toLowerCase().includes(searchLower)
            );
        }

        res.status(200).json(journals);
    } catch (error) {
        console.error("Error fetching journal entries:", error);
        res.status(500).json({ 
            message: "Failed to fetch journal entries",
            error: error.message 
        });
    }
};

// Get a single journal entry by ID
export const getJournalEntryById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const journal = await Journal.findOne({ _id: id, userId });

        if (!journal) {
            return res.status(404).json({ message: "Journal entry not found" });
        }

        res.status(200).json(journal);
    } catch (error) {
        console.error("Error fetching journal entry:", error);
        res.status(500).json({ 
            message: "Failed to fetch journal entry",
            error: error.message 
        });
    }
};

// Update a journal entry
export const updateJournalEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const { title, content, entryDate, mood, tags } = req.body;

        const journal = await Journal.findOne({ _id: id, userId });

        if (!journal) {
            return res.status(404).json({ message: "Journal entry not found" });
        }

        if (title) journal.title = title;
        if (content) journal.content = content;
        if (entryDate) journal.entryDate = entryDate;
        if (mood !== undefined) journal.mood = mood;
        if (tags) journal.tags = tags;

        await journal.save();
        res.status(200).json(journal);
    } catch (error) {
        console.error("Error updating journal entry:", error);
        res.status(500).json({ 
            message: "Failed to update journal entry",
            error: error.message 
        });
    }
};

// Delete a journal entry
export const deleteJournalEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const journal = await Journal.findOneAndDelete({ _id: id, userId });

        if (!journal) {
            return res.status(404).json({ message: "Journal entry not found" });
        }

        res.status(200).json({ 
            message: "Journal entry deleted successfully",
            id: journal._id 
        });
    } catch (error) {
        console.error("Error deleting journal entry:", error);
        res.status(500).json({ 
            message: "Failed to delete journal entry",
            error: error.message 
        });
    }
};

// Get journal entries by date (for calendar view)
export const getJournalEntriesByMonth = async (req, res) => {
    try {
        const userId = req.userId;
        const { year, month } = req.query;

        if (!year || !month) {
            return res.status(400).json({ 
                message: "Year and month are required" 
            });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const journals = await Journal.find({
            userId,
            entryDate: { $gte: startDate, $lte: endDate }
        })
        .sort({ entryDate: -1 })
        .select('title entryDate mood tags')
        .lean();

        res.status(200).json(journals);
    } catch (error) {
        console.error("Error fetching journal entries by month:", error);
        res.status(500).json({ 
            message: "Failed to fetch journal entries",
            error: error.message 
        });
    }
};
