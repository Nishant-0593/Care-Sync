const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db_postgres');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.users.findUnique({
            where: { id: decoded.id },
            select: { id: true, name: true, email: true, role: true }
        });
        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `User role ${req.user.role} is not authorized to access this route` 
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
