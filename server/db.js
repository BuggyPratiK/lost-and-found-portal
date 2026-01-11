const mongoose = require('mongoose');
require('dotenv').config(); // Ensures environment variables are loaded

// --- Schema Definitions ---

// Schema for Teachers (Admins)
const teacherSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    firstName: {
        type: String,
        required: [true, 'Please provide a first name'],
    },
    lastName: {
        type: String,
        required: [true, 'Please provide a last name'],
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

// Schema for Lost & Found Items
const itemSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Please provide a description of the item'],
    },
    foundLocation: {
        type: String,
        required: [true, 'Please specify where the item was found'],
    },
    collectionLocation: {
        type: String,
        required: [true, 'Please specify where the item can be collected from'],
    },
    imagePath: {
        type: String,
        required: [true, 'An image path is required'], // Stores the path to the uploaded image file
    },
    status: {
        type: String,
        enum: ['Lost', 'Collected', 'Archived'], // The item can only have one of these statuses
        default: 'Lost', // New items are 'Lost' by default
    },
    uploadDate: {
        type: Date,
        default: Date.now, // Automatically sets the date when an item is created
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Teacher', // Creates a reference to the Teacher model
    }
}, {
    timestamps: true
});


// --- Model Creation ---

const Teacher = mongoose.model('Teacher', teacherSchema);
const Item = mongoose.model('Item', itemSchema);


// --- Database Connection Function ---

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected successfully!');
    } catch (error) {
        console.error('MongoDB Connection Failed:', error.message);
        // Exit process with failure
        process.exit(1);
    }
};

// --- Exports ---

module.exports = {
    connectDB,
    Teacher,
    Item,
};