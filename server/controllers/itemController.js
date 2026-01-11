const { Item } = require('../db');

// --- Controller to ADD a new item ---
// This is a protected route, so it relies on `req.user` from the authMiddleware.
const addItem = async (req, res) => {
    try {
        const { description, foundLocation, collectionLocation } = req.body;
        
        // Check if a file was successfully uploaded by multer
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image for the item.' });
        }

        // Create a new item document in the database
        const newItem = new Item({
            description,
            foundLocation,
            collectionLocation,
            imagePath: req.file.path, // Get the file path that multer saved
            // Get the logged-in teacher's ID from req.user (provided by authMiddleware)
            uploadedBy: req.user._id, 
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);

    } catch (error) {
        console.error('Error in addItem controller:', error);
        res.status(500).json({ 
            message: "Server Error: Could not add item.", 
            error: error.message 
        });
    }
};


// --- Controller to UPDATE an item's status to 'Collected' ---
// This is also a protected route.
const updateItemStatus = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        item.status = 'Collected';
        const updatedItem = await item.save();
        res.status(200).json(updatedItem);

    } catch (error) {
        console.error('Error updating item status:', error);
        res.status(500).json({ message: 'Server Error: Could not update item status.' });
    }
};


// --- Controllers to GET items (for the public/student view) ---
// --- Controller to GET Lost Items with Date Filtering ---
const getLostItems = async (req, res) => {
    try {
        // Build a query object based on the request
        const query = { status: 'Lost' };

        // Check for startDate and endDate in the query parameters
        const { startDate, endDate } = req.query;
        if (startDate && endDate) {
            query.uploadDate = {
                $gte: new Date(startDate), // Greater than or equal to start date
                $lte: new Date(endDate)    // Less than or equal to end date
            };
        }

        const items = await Item.find(query)
            .populate('uploadedBy', 'name')
            .sort({ uploadDate: -1 });
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching lost items:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


const getCollectedItems = async (req, res) => {
    try {
        const items = await Item.find({ status: 'Collected' })
            .populate('uploadedBy', 'name')
            .sort({ uploadDate: -1 });
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching collected items:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// --- Controller: Get Archived Items ---
const getArchivedItems = async (req, res) => {
    try {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        // Find items that are still 'Lost' but were uploaded more than a month ago
        const items = await Item.find({ 
            status: 'Lost',
            uploadDate: { $lte: oneMonthAgo }
        }).populate('uploadedBy', 'name');

        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching archived items:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- NEW CONTROLLER: Get Item Statistics ---
const getItemStats = async (req, res) => {
    try {
        const stats = await Item.aggregate([
            // Stage 1: filter the documents to only include 'Lost' items.
            {
                $match: { status: 'Lost' }
            },
            // stage 2: group  the filtered documents by month and year
            {
                $group: {
                    _id: {
                        year: { $year: "$uploadDate" },
                        month: { $month: "$uploadDate" }
                    },
                    // Count the number of items in each group
                    count: { $sum: 1 }
                }
            },
            //Stage 3: sort the results chronologically.
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);
        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching item stats:', error);
        res.status(500).json({ message: 'Server Error: Could not fetch stats.' });
    }
};


// Export all the controller functions so they can be used in itemRoutes.js
module.exports = {
    addItem,
    updateItemStatus,
    getLostItems,
    getCollectedItems,
    getArchivedItems,
    getItemStats
};