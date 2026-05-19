const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    child: {
        type: mongoose.Schema.ObjectId,
        ref: 'Child',
        required: true
    },
    teacher: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String // Path to uploaded image
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);
