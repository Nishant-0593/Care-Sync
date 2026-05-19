const Timetable = require('../models/Timetable');

exports.getTimetable = async (req, res) => {
    try {
        let query;
        if (req.user.role === 'admin') {
            query = Timetable.find().populate('teacher', 'name');
        } else if (req.user.role === 'teacher') {
            query = Timetable.find({ teacher: req.user.id });
        } else if (req.user.role === 'parent') {
            // In a real scenario, parent queries timetable of their child's teacher
            // For now, we fetch all, or we could require teacher ID in query params
            const teacherId = req.query.teacherId;
            if (teacherId) {
                query = Timetable.find({ teacher: teacherId });
            } else {
                return res.status(400).json({ message: 'Please provide a teacherId query param to fetch class timetable' });
            }
        }
        const records = await query;
        res.status(200).json({ success: true, count: records.length, data: records });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createTimetable = async (req, res) => {
    try {
        // Assume teachers can create their own timetables, or admin creates them.
        const teacherId = req.user.role === 'teacher' ? req.user.id : req.body.teacherId;
        
        const timetable = await Timetable.create({
            ...req.body,
            teacher: teacherId
        });
        res.status(201).json({ success: true, data: timetable });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
