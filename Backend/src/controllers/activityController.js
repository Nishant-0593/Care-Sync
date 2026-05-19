const Activity = require('../models/Activity');
const Child = require('../models/Child');

exports.getActivities = async (req, res) => {
    try {
        let query;
        if (req.user.role === 'admin') {
            query = Activity.find().populate('child', 'name').populate('teacher', 'name');
        } else if (req.user.role === 'teacher') {
            query = Activity.find({ teacher: req.user.id }).populate('child', 'name');
        } else if (req.user.role === 'parent') {
            const children = await Child.find({ parent: req.user.id }).select('_id');
            const childIds = children.map(c => c._id);
            query = Activity.find({ child: { $in: childIds } }).populate('child', 'name').populate('teacher', 'name');
        }
        const records = await query;
        res.status(200).json({ success: true, count: records.length, data: records });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.uploadActivity = async (req, res) => {
    try {
        const { childId, title, description } = req.body;
        
        const child = await Child.findById(childId);
        if (!child) return res.status(404).json({ message: 'Child not found' });

        if (req.user.role === 'teacher' && child.teacher.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized for this child' });
        }

        const imagePath = req.file ? `/uploads/activities/${req.file.filename}` : undefined;

        const activity = await Activity.create({
            child: childId,
            teacher: req.user.id, // Teacher uploading
            title,
            description,
            image: imagePath
        });
        
        res.status(201).json({ success: true, data: activity });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) return res.status(404).json({ message: 'Activity not found' });

        // Only the teacher who posted or an admin can delete
        if (req.user.role === 'teacher' && activity.teacher.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this activity' });
        }

        await activity.deleteOne();
        res.status(200).json({ success: true, message: 'Activity deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
