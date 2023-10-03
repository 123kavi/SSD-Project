const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Users = require('./models/userModel');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const passportSetup = require('./passport');
const passport = require('passport');
const cookieSession = require('cookie-session');
const path = require('path');

// Initialize Express app
const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}));
app.use(fileUpload({ useTempFiles: true }));

// Configure cookie session
app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // Session duration (30 days in milliseconds)
    keys: ['codesoftic'], // Encryption keys
    secure: true, // Only transmit cookies over HTTPS (recommended for production)
    httpOnly: true, // Restrict cookie access to JavaScript (recommended for security)
    sameSite: 'strict' // Set the SameSite attribute for added security
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect("mongodb+srv://kaviravihansi1:m84BZh2vXtcCRij6@cluster0.n31wihn.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
})
    .then(() => {
        console.log(`Data is connected successfully`);
    })
    .catch((err) => {
        console.log('Not connected', err);
    });

// Include routes
app.use('/auth', require('./router/auth'));
app.use('/user', require('./routes/userRouter'));
app.use('/api', require('./routes/categoryRouter'));
app.use('/api', require('./routes/upload'));
app.use('/api', require('./routes/productRouter'));
app.use('/api', require('./routes/paymentRouter'));
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email });

        if (!user) return res.status(400).json({ msg: "This email does not exist." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Password is incorrect." });

        // Store user data in the session
        req.session.user = user;

        const refresh_token = refresh_token({ id: user._id });
        res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: '/user/refresh_token',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ msg: "Login success!" });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});
// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});
