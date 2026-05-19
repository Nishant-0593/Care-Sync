const express = require('express');
const { getTimetable, createTimetable } = require('../controllers/timetableController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getTimetable)
    .post(authorize('admin', 'teacher'), createTimetable);

module.exports = router;
