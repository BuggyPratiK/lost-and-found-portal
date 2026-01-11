const express = require('express');
const { registerTeacher, loginTeacher } = require('../controllers/teacherController');
const router = express.Router();

// POST /api/teachers/register
router.post('/register', registerTeacher);

// POST /api/teachers/login
router.post('/login', loginTeacher);

module.exports = router;