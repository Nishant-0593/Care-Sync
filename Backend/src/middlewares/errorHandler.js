// Error Handling Middleware (Syllabus Topic)
// Demonstrates: Error-handling middleware lifecycle
const errorHandler = (err, req, res, next) => {
    console.error(`--- Error Caught by Global Middleware: ${err.message} ---`);

    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Handling Mongoose specific errors (Syllabus: No SQL Databases/Mongoose)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found: Invalid ID format';
    }

    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
};

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = { errorHandler, notFound };
