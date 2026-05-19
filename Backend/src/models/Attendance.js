const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
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
    status: {
        type: String,
        enum: ['present', 'absent', 'late'],
        required: true
    },
    remarks: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Attendance', attendanceSchema);
