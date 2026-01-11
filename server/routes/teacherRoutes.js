const express = require('express');
const { registerTeacher, loginTeacher } = require('../controllers/teacherController');
const router = express.Router();

// Route for teacher registration (optional, you can pre-populate the database)
// POST /api/teachers/register
router.post('/register', registerTeacher);

// Route for teacher login
// POST /api/teachers/login
router.post('/login', loginTeacher);

module.exports = router;