const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    dayOfWeek: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        required: true
    },
    startTime: {
        type: String, // e.g., '09:00'
        required: true
    },
    endTime: {
        type: String, // e.g., '10:00'
        required: true
    },
    activity: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Timetable', timetableSchema);
