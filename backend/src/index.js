require('dotenv').config();
const mongoose = require("mongoose");
const express = require('express');
const cors = require('cors');

// Importing routes
const calendarRoutes = require("./components/Route/calenderRoutes");

const app = express();

// Environment variables
const mongoURL = process.env.MONGODB_URL;
const port = process.env.PORT || 3000; // Default to port 3000 if PORT is not defined

// Check if MongoDB URL is defined
if (!mongoURL) {
    console.error("MONGODB_URL is not defined in the .env file");
    process.exit(1); // Exit the process with a failure code
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/calendar", calendarRoutes);

// Fallback route for undefined endpoints
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

// Start server and connect to MongoDB
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Connected to MongoDB successfully");
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); // Exit the process on failure to connect to MongoDB
    });
