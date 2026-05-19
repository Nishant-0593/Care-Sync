const express = require('express');
const { getAttendance, markAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getAttendance)
    .post(authorize('admin', 'teacher'), markAttendance);

module.exports = router;
