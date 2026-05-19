const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, adminSecretKey, teacherSecretKey } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Role-based security checks
        if (role === 'admin') {
            // 1. Check if an admin already exists
            const adminExists = await User.findOne({ role: 'admin' });
            if (adminExists) {
                return res.status(400).json({ 
                    message: 'An Administrator account already exists. Only one Administrator is allowed.' 
                });
            }

            // 2. Verify Admin Secret Key
            if (adminSecretKey !== process.env.ADMIN_SIGNUP_KEY) {
                return res.status(401).json({ 
                    message: 'Unauthorized: Invalid Admin Secret Key. You cannot create an Administrator account.' 
                });
            }
        } else if (role === 'teacher') {
            // Verify Teacher Secret Key
            if (teacherSecretKey !== process.env.TEACHER_SIGNUP_KEY) {
                return res.status(401).json({ 
                    message: 'Unauthorized: Invalid Teacher Invite Code. You cannot create a Teacher account.' 
                });
            }
        }

        const user = await User.create({
            name,
            email,
            password,
            role
        });

        const token = generateToken(user._id);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide an email and password' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot password (Generate OTP)
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: 'There is no user with that email' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP and set to user model
        user.otp = crypto.createHash('sha256').update(otp).digest('hex');
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
        await user.save({ validateBeforeSave: false });

        const message = `Your password reset OTP is: ${otp}\nIf you did not request this, please ignore this email.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset OTP',
                message
            });
        } catch (error) {
            console.error('Failed to send email:', error.message);
            // In development mode, allow proceeding even if email fails so user can test using console OTP
            if (process.env.NODE_ENV !== 'development') {
                user.otp = undefined;
                user.otpExpires = undefined;
                await user.save({ validateBeforeSave: false });
                return res.status(500).json({ message: 'Email could not be sent' });
            }
        }

        console.log(`\n======================================`);
        console.log(`[DEV MODE] OTP for ${user.email}: ${otp}`);
        console.log(`======================================\n`);

        res.status(200).json({ 
            success: true, 
            message: 'OTP sent to email (or logged to console in dev mode).',
            ...(process.env.NODE_ENV === 'development' && { devOtp: otp })
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset password using OTP
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        const user = await User.findOne({
            email,
            otp: hashedOtp,
            otpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.password = newPassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Public
exports.logout = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
    try {
        const { role } = req.query;
        let query = { _id: { $ne: req.user.id } }; // Exclude current admin
        if (role) {
            query.role = role;
        }
        const users = await User.find(query).select('name email role');
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check if an admin exists
// @route   GET /api/auth/admin-exists
// @access  Public
exports.checkAdminExists = async (req, res) => {
    try {
        const admin = await User.findOne({ role: 'admin' });
        res.status(200).json({ exists: !!admin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
