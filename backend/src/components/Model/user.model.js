const mongoose = require("mongoose");
const { Schema } = mongoose;

const CalendarSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true
    },
    event: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
    },
    startingTime: {
        type: String, // Storing time in "HH:MM" format
        required: true,
        trim: true,
    },
    endingTime: {
        type: String, // Storing time in "HH:MM" format
        required: true,
        trim: true,
    }
}, {
    timestamps: true
});

const Event = mongoose.model("Event", CalendarSchema);

module.exports = { Event };
