const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a notice title']
    },
    message: {
        type: String,
        required: [true, 'Please add a notice message']
    },
    type: {
        type: String,
        enum: ['General', 'Safety', 'Event', 'Holiday'],
        default: 'General'
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notice', noticeSchema);
