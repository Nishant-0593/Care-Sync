const Child = require('../models/Child');

// @desc    Get children based on role
// @route   GET /api/children
// @access  Private (Admin, Teacher, Parent)
exports.getChildren = async (req, res) => {
    try {
        let query;

        // Role-based logic for fetching data
        if (req.user.role === 'admin') {
            // Admin sees all children
            query = Child.find()
                .populate('parent', 'name email')
                .populate('teacher', 'name email'); 
        } else if (req.user.role === 'teacher') {
            // Teacher sees only their assigned students
            console.log('Fetching for teacher ID:', req.user._id.toString());
            query = Child.find({ teacher: req.user._id })
                .populate('parent', 'name email'); 
        } else if (req.user.role === 'parent') {
            // Parent sees only their own children
            console.log('Searching for children assigned to parent ID:', req.user._id.toString());
            query = Child.find({ parent: req.user._id })
                .populate('teacher', 'name email'); 
        }

        const children = await query;
        res.status(200).json({ success: true, count: children.length, data: children });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a child profile
// @route   POST /api/children
// @access  Private (Admin only)
exports.createChild = async (req, res) => {
    try {
        const child = await Child.create(req.body);
        res.status(201).json({ success: true, data: child });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single child
// @route   GET /api/children/:id
// @access  Private (Admin, Teacher, Parent)
exports.getChildById = async (req, res) => {
    try {
        const child = await Child.findById(req.params.id)
            .populate('parent', 'name email')
            .populate('teacher', 'name email');

        if (!child) {
            return res.status(404).json({ message: 'Child not found' });
        }

        // Role-based authorization check
        if (req.user.role !== 'admin') {
            if (req.user.role === 'parent' && child.parent._id.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized to access this child' });
            }
            if (req.user.role === 'teacher' && child.teacher._id.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized to access this child' });
            }
        }

        res.status(200).json({ success: true, data: child });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a child
// @route   PUT /api/children/:id
// @access  Private (Admin only)
exports.updateChild = async (req, res) => {
    try {
        let child = await Child.findById(req.params.id);
        if (!child) return res.status(404).json({ message: 'Child not found' });

        child = await Child.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: child });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a child
// @route   DELETE /api/children/:id
// @access  Private (Admin only)
exports.deleteChild = async (req, res) => {
    try {
        const child = await Child.findById(req.params.id);
        if (!child) return res.status(404).json({ message: 'Child not found' });

        await child.deleteOne();
        res.status(200).json({ success: true, message: 'Child record deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
