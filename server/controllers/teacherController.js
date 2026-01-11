const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Teacher } = require('../db');

// @desc    Register a new teacher
// @route   POST /api/teachers/register
// @access  Public
const registerTeacher = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
        const teacherExists = await Teacher.findOne({ email });

        if (teacherExists) {
            return res.status(400).json({ message: 'Teacher already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const teacher = await Teacher.create({
            email,
            password: hashedPassword,
            firstName,
            lastName
        });
        
        const savedTeacher = await teacher.save();

        if (teacher) {
            res.status(201).json({
                _id: savedTeacher._id,
                email: savedTeacher.email,
                name: `${savedTeacher.firstName} ${savedTeacher.lastName}`,
                token: generateToken(savedTeacher._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid teacher data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Authenticate teacher & get token
// @route   POST /api/teachers/login
// @access  Public
const loginTeacher = async (req, res) => {
    const { email, password } = req.body;

    try {
        const teacher = await Teacher.findOne({ email });

        if (teacher && (await bcrypt.compare(password, teacher.password))) {
            res.json({
                _id: teacher._id,
                email: teacher.email,
                name: `${teacher.firstName} ${teacher.lastName}`,
                token: generateToken(teacher._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

module.exports = { registerTeacher, loginTeacher };