const Newsletter = require('../models/Newsletter');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
exports.subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Please provide an email address' });
        }

        // Check if email already subscribed
        let subscriber = await Newsletter.findOne({ email });
        if (subscriber) {
            return res.status(400).json({ success: false, message: 'Email is already subscribed to our newsletter' });
        }

        subscriber = await Newsletter.create({ email });

        res.status(201).json({
            success: true,
            message: 'Successfully subscribed to the newsletter!',
            data: subscriber
        });
    } catch (error) {
        console.error('subscribeNewsletter error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
