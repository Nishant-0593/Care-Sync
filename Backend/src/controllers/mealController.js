const Meal = require('../models/Meal');
const Child = require('../models/Child');

exports.getMeals = async (req, res) => {
    try {
        let query;
        if (req.user.role === 'admin') {
            query = Meal.find().populate('child', 'name');
        } else if (req.user.role === 'teacher') {
            const children = await Child.find({ teacher: req.user.id }).select('_id');
            const childIds = children.map(c => c._id);
            query = Meal.find({ child: { $in: childIds } }).populate('child', 'name');
        } else if (req.user.role === 'parent') {
            const children = await Child.find({ parent: req.user.id }).select('_id');
            const childIds = children.map(c => c._id);
            query = Meal.find({ child: { $in: childIds } }).populate('child', 'name');
        }
        const records = await query;
        res.status(200).json({ success: true, count: records.length, data: records });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addMealRecord = async (req, res) => {
    try {
        const { childId, mealType, status, notes } = req.body;
        const child = await Child.findById(childId);
        if (!child) return res.status(404).json({ message: 'Child not found' });

        if (req.user.role === 'teacher' && child.teacher.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized for this child' });
        }

        const meal = await Meal.create({ child: childId, mealType, status, notes });
        res.status(201).json({ success: true, data: meal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
