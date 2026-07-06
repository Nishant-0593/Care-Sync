const { prisma } = require('../config/db_postgres');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

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

        const userExists = await prisma.users.findUnique({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Role-based security checks
        if (role === 'admin') {
            const adminExists = await prisma.users.findFirst({ where: { role: 'admin' } });
            if (adminExists) {
                return res.status(400).json({ 
                    message: 'An Administrator account already exists. Only one Administrator is allowed.' 
                });
            }

            if (adminSecretKey !== process.env.ADMIN_SIGNUP_KEY) {
                return res.status(401).json({ 
                    message: 'Unauthorized: Invalid Admin Secret Key. You cannot create an Administrator account.' 
                });
            }
        } else if (role === 'teacher') {
            if (teacherSecretKey !== process.env.TEACHER_SIGNUP_KEY) {
                return res.status(401).json({ 
                    message: 'Unauthorized: Invalid Teacher Invite Code. You cannot create a Teacher account.' 
                });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.users.create({
            data: { name, email, password: hashedPassword, role: role || 'parent' },
            select: { id: true, name: true, email: true, role: true }
        });

        const token = generateToken(user.id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.status(201).json({
            success: true,
            token,
            user
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

        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user.id);

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
                id: user.id,
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
        const user = await prisma.users.findUnique({ where: { email: req.body.email } });
        if (!user) {
            return res.status(404).json({ message: 'There is no user with that email' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
        const expires = new Date(Date.now() + 10 * 60 * 1000); 

        await prisma.users.update({
            where: { id: user.id },
            data: { otp: hashedOtp, otp_expires: expires }
        });

        const message = `Your password reset OTP is: ${otp}\nIf you did not request this, please ignore this email.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset OTP',
                message
            });
        } catch (error) {
            console.error('Failed to send email:', error.message);
            if (process.env.NODE_ENV !== 'development') {
                await prisma.users.update({
                    where: { id: user.id },
                    data: { otp: null, otp_expires: null }
                });
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

        const user = await prisma.users.findFirst({
            where: {
                email,
                otp: hashedOtp,
                otp_expires: { gt: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await prisma.users.update({
            where: { id: user.id },
            data: { password: hashedPassword, otp: null, otp_expires: null }
        });

        res.status(200).json({
            success: true,
            token: generateToken(user.id)
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
        const whereClause = { id: { not: req.user.id } };

        if (role) {
            whereClause.role = role;
        }

        const users = await prisma.users.findMany({
            where: whereClause,
            select: { id: true, name: true, email: true, role: true }
        });
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
        const admin = await prisma.users.findFirst({
            where: { role: 'admin' },
            select: { id: true }
        });
        res.status(200).json({ exists: !!admin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
