const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add child name']
    },
    age: {
        type: Number,
        required: [true, 'Please add child age']
    },
    parent: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    teacher: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Child', childSchema);
