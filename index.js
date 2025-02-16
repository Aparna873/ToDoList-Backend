const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

// Enable CORS for multiple origins
app.use(cors({
    origin: ['https://taskito-planner.vercel.app', 'http://localhost:5173'], // Allow these origins
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // Allow cookies & authentication headers
}));

app.use(express.json());

// ✅ Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

// ✅ Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/taskRoute')); // Register task routes
app.use('/api/profile', require('./routes/profileRoute'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Handle errors
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});