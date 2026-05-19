const express = require('express');
const { createNotice, getNotices } = require('../controllers/noticeController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getNotices);
router.post('/', protect, authorize('admin'), createNotice);

module.exports = router;
