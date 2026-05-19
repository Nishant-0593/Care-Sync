const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const childRoutes = require('./childRoutes');
const attendanceRoutes = require('./attendanceRoutes');
const timetableRoutes = require('./timetableRoutes');
const mealRoutes = require('./mealRoutes');
const activityRoutes = require('./activityRoutes');
const messageRoutes = require('./messageRoutes');
const noticeRoutes = require('./noticeRoutes');

const { getNoticeBoard } = require('../controllers/noticeController');

// Basic health check route
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'API is running' });
});

// SSR Route for Syllabus Compliance (Dynamic MongoDB Data)
router.get('/notice', getNoticeBoard);

router.use('/auth', authRoutes);
router.use('/children', childRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/timetable', timetableRoutes);
router.use('/meals', mealRoutes);
router.use('/activities', activityRoutes);
router.use('/messages', messageRoutes);
router.use('/notices', noticeRoutes);

module.exports = router;
