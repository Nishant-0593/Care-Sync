const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    child: {
        type: mongoose.Schema.ObjectId,
        ref: 'Child',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    mealType: {
        type: String,
        enum: ['breakfast', 'lunch', 'snack'],
        required: true
    },
    status: {
        type: String,
        enum: ['eaten', 'partially eaten', 'refused'],
        required: true
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Meal', mealSchema);
