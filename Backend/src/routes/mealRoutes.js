const express = require('express');
const { getMeals, addMealRecord } = require('../controllers/mealController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getMeals)
    .post(authorize('admin', 'teacher'), addMealRecord);

module.exports = router;
