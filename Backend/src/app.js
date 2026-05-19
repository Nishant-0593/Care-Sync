const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const requestLogger = require('./middlewares/logger');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const routes = require('./routes');

const app = express();

const path = require('path');

// EJS Configuration (Syllabus: SSR vs CSR)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true
}));
app.use(cookieParser());
app.use(requestLogger);

// Session Configuration (Syllabus: Session management)
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Passport Middleware (Syllabus: passport JS)
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api', routes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
