const express = require('express');
const { getActivities, uploadActivity, deleteActivity } = require('../controllers/activityController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getActivities)
    // Use multer upload middleware for single 'image' field
    .post(authorize('admin', 'teacher'), upload.single('image'), uploadActivity);

router.route('/:id')
    .delete(authorize('admin', 'teacher'), deleteActivity);

module.exports = router;
