require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./db');
const teacherRoutes = require('./routes/teacherRoutes');
const itemRoutes = require('./routes/itemRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/teachers', teacherRoutes);
app.use('/api/items', itemRoutes);

// Simple root route
app.get('/', (req, res) => {
    res.send('Lost & Found Portal API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});