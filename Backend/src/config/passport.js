const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

// Syllabus Topic: passport JS
// This file demonstrates how to use Passport with a Local Strategy

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return done(null, false, { message: 'Invalid email' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return done(null, false, { message: 'Invalid password' });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Serialize/Deserialize for Session support
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;
