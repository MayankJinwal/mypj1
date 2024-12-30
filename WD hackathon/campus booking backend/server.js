const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const User = require(path.join(__dirname, 'model', 'user')); // Model ka path
const cors = require('cors');
const app = express();

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the views folder

// MongoDB connection string
const MONGO_URI = 'mongodb+srv://mayank:lnZLVseh7YqESqpG@cluster0.vrvs5.mongodb.net/campus?retryWrites=true&w=majority';
const JWT_SECRET = 'your-jwt-secret-key';

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data

// MongoDB connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Integrate auth routes
app.use('/api', authRoutes);

// EJS Home route
app.get('/', (req, res) => {
    res.render('index'); // Render the index.ejs file
});

// Signup page route
app.get('/signup', (req, res) => {
    res.render('signup'); // Render signup.ejs
});

// Login page route
app.get('/login', (req, res) => {
    res.render('login'); // Render login.ejs
});

// Signup logic
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    const cleanedEmail = email.trim().toLowerCase(); // Clean email
    const existingUser = await User.findOne({ username: cleanedEmail }); // Assuming username = email

    if (existingUser) {
        return res.status(400).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username: cleanedEmail, password: hashedPassword });
    await user.save();
    res.status(201).send('User registered');
});

// Login logic
app.post('/login', async (req, res) => {
    console.log('Request body:', req.body); // Log the request body for debugging

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    const cleanedEmail = email.trim().toLowerCase();
    console.log('Login attempt for user:', cleanedEmail); // Log the cleaned email

    const user = await User.findOne({ username: cleanedEmail }); // Assuming username = email in DB
    console.log('User found:', user); // Log the found user

    if (!user) {
        return res.status(401).send('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid); // Log password validity

    if (!isPasswordValid) {
        return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ username: cleanedEmail }, JWT_SECRET);
    res.json({ message: 'Login successful', token });
});

// Middleware to verify token
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log("Token verification failed:", err);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

// Protected route example (for services)
app.get('/services', authenticateToken, (req, res) => {
    res.json([{ name: 'Food Order' }, { name: 'Venue Booking' }]);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));