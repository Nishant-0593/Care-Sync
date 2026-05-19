const Attendance = require('../models/Attendance');
const Child = require('../models/Child');

exports.getAttendance = async (req, res) => {
    try {
        let query;
        if (req.user.role === 'admin') {
            query = Attendance.find().populate('child', 'name');
        } else if (req.user.role === 'teacher') {
            const children = await Child.find({ teacher: req.user.id }).select('_id');
            const childIds = children.map(c => c._id);
            query = Attendance.find({ child: { $in: childIds } }).populate('child', 'name');
        } else if (req.user.role === 'parent') {
            const children = await Child.find({ parent: req.user.id }).select('_id');
            const childIds = children.map(c => c._id);
            query = Attendance.find({ child: { $in: childIds } }).populate('child', 'name');
        }
        const records = await query;
        res.status(200).json({ success: true, count: records.length, data: records });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.markAttendance = async (req, res) => {
    try {
        const { childId, status, remarks } = req.body;
        const child = await Child.findById(childId);
        if (!child) return res.status(404).json({ message: 'Child not found' });

        // Enforce RBAC
        if (req.user.role === 'teacher' && child.teacher.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized for this child' });
        }

        const attendance = await Attendance.create({ child: childId, status, remarks });
        res.status(201).json({ success: true, data: attendance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
