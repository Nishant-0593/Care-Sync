const express = require('express');
const { getChildren, createChild, getChildById, updateChild, deleteChild } = require('../controllers/childController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(protect);

// GET /api/children - Access for all authenticated users (data filtered in controller)
// POST /api/children - Access restricted to Admin only via authorize middleware
router.route('/')
    .get(getChildren)
    .post(authorize('admin'), createChild);

// GET /api/children/:id - Access for all but specific document validation in controller
router.route('/:id')
    .get(getChildById)
    .put(authorize('admin'), updateChild)
    .delete(authorize('admin'), deleteChild);

module.exports = router;
