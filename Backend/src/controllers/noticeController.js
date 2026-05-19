const Notice = require('../models/Notice');

// @desc    Get all notices for SSR Notice Board
// @route   GET /notice
// @access  Public
exports.getNoticeBoard = async (req, res) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 });
        
        // If no notices exist, provide a default one so the page doesn't look empty
        const displayNotices = notices.length > 0 ? notices : [{
            title: 'Welcome to CareSync',
            message: 'This is our official notice board. Check back here for school updates and safety protocols.',
            createdAt: new Date()
        }];

        res.render('notice', { 
            title: 'CareSync Notice Board', 
            notices: displayNotices 
        });
    } catch (error) {
        res.status(500).send('Error loading notice board');
    }
};

// @desc    Create a new notice
// @route   POST /api/notices
// @access  Private (Admin)
exports.createNotice = async (req, res) => {
    try {
        const notice = await Notice.create({
            ...req.body,
            createdBy: req.user.id
        });
        res.status(201).json({ success: true, data: notice });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get notices API
// @route   GET /api/notices
// @access  Public
exports.getNotices = async (req, res) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: notices });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
