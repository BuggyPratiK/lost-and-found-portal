const express = require('express');
const router = express.Router();

// Import middleware
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Standard practice to name the import 'upload'

// Import all controller functions from the single exported object
// This ensures all function names match what is in itemController.js
const {
  addItem,
  getLostItems,
  getCollectedItems,
  updateItemStatus, // This now correctly matches the controller function
  getArchivedItems,
  getItemStats
} = require('../controllers/itemController');


// --- PUBLIC ROUTES (Accessible to Students without login) ---

// GET /api/items/lost -> Fetches all currently lost items (not archived)
router.get('/lost', getLostItems);

// GET /api/items/collected -> Fetches all items in the "collected" history
router.get('/collected', getCollectedItems);

// GET /api/items/archived -> Fetches items older than 1 month (3rd Year Feature)
router.get('/archived', getArchivedItems);


// --- PROTECTED ROUTES (Requires Teacher to be logged in) ---

// POST /api/items -> Adds a new lost item
// 'authMiddleware' runs first to check for a valid token.
// 'upload.single('itemImage')' runs next to process the file upload.
// 'addItem' is the final controller function that runs.
router.post('/', authMiddleware, upload.single('itemImage'), addItem);

// PATCH /api/items/:id/collect -> Marks a specific item as collected
router.patch('/:id/collect', authMiddleware, updateItemStatus);

router.get('/stats', getItemStats);

module.exports = router;