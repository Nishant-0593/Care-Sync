// Custom Middleware: Request Logger
// Syllabus Topic: Middleware lifecycle (Application-level middleware)

const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    // Log basic info
    console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);
    
    // Once the response is finished, log the duration and status
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`Status: ${res.statusCode} | Duration: ${duration}ms`);
    });
    
    next();
};

module.exports = requestLogger;
