const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "J^~4b!8L_.AW-sgH7y3vZ+TpR!cNwE2p";
const path = require("path");
const app = express();
const port = 3000;

const User = require('../model/user');

app.use(express.json()); // For parsing JSON data
app.use(express.urlencoded({ extended: true }));
app.use("/css", express.static(__dirname + "/css"));
app.use("/img", express.static(__dirname + "/img"));
console.log(__dirname);

app.use(express.static('public'));

app.get('/admin_meals', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin_meals.html'));
  });


// MongoDB connection
const mongoURI = 'mongodb+srv://admin:admin@users.hj0kt.mongodb.net/?retryWrites=true&w=majority&appName=users'; 
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB:', err));
const conn = mongoose.connection;

// Middleware
//app.use(cors());
app.use(bodyParser.json());

// Middleware for JWT verification
function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(path.resolve(), "views", "login.html"));
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "No user found with this email." });
        }

        console.log("User found:", user);

        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid password." });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: "Login successful", token, user });

    } catch (err) {
        console.log("Error during login:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.get('/check-fields', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const requiredFields = ['age', 'gender', 'height', 'weight', 'selectedGoal'];
        const missingFields = requiredFields.filter(field => !user[field]);

        if (missingFields.length > 0) {
            return res.status(200).json({ message: "Incomplete profile", missingFields });
        }
        res.status(200).json({ message: "Profile complete" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/save-data', verifyToken, async (req, res) => {
    const { age, gender, height, weight, selectedGoal } = req.body;
    try {
        const user = await User.findByIdAndUpdate(req.user.id, { age, gender, height, weight, selectedGoal }, { new: true });
        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});


//Fetching user details for profile icon
app.get('/get-user-details', verifyToken, async (req, res) => {
    try {
        // Fetch the user details from the database
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prepare user details to return
        const userDetails = {
            email: user.email,
            f_name: user.f_name,
            l_name: user.l_name,
            age: user.age,
            gender: user.gender,
            height: user.height,
            weight: user.weight,
            selectedGoal: user.selectedGoal,
        };

        res.status(200).json({ message: "User details retrieved successfully", userDetails });
    } catch (err) {
        console.error("Error fetching user details:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});


app.get("/register", (req, res) => {
    res.sendFile(path.join(path.resolve(), "views", "signup.html"));
});

app.post('/register', async (req, res) => {
    const { f_name, l_name, mobile, email, password } = req.body;

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email: email });
        console.log("Existing user:", existingUser);
        if (existingUser) {
            return res.status(409).json({ message: "An user with this email already found" });
        }

        // Create a new user
        const user = new User({ f_name, l_name, mobile, email, password });
        await user.save();
        console.log("User created");
        res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error registering user', error: err.message });
    }
});

app.get("/redirect", (req, res) => {
    res.sendFile(path.join(path.resolve(), "views", "login.html"));
});

app.get("/init-frame1", (req, res) => {
    res.sendFile(path.join(path.resolve(), "views", "init-frame1.html"));
});

app.get("/init-frame2", (req, res) => {
    res.sendFile(path.join(path.resolve(), "views", "init-frame2.html"));
});

app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(path.resolve(), "views", "dashboard.html"));
});

app.get("/profile", (req, res) => {
    res.sendFile(path.join(path.resolve(), "views", "profile.html"));
});

app.get("/logout", (req, res) => {
    res.sendFile(path.join(path.resolve(), "views", "login.html"));
});

app.get("/workouts", (req, res) => {
    res.sendFile(path.join(path.resolve(), "views", "workouts.html"));
});

app.get('/get-day', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ 
            day: user.day || 0, 
            month: user.month || 1 
        });
    } catch (err) {
        console.error("Error retrieving day and month:", err);
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/update-day', verifyToken, async (req, res) => {
    try {
        const { day, month } = req.body; // Receive day and month
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's day and month
        user.day = day;
        user.month = month;

        await user.save();

        res.status(200).json({ message: 'Day and month updated successfully' });
    } catch (err) {
        console.error('Error updating day and month:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get("/support-center", (req, res) => {
    res.sendFile(path.join(path.resolve(), "views", "support-center.html"));
});

app.get("/foods", (req, res) => {
    res.sendFile(path.join(path.resolve(), "views", "foods.html"));
});

app.get("/tutorials", (req, res) => {
    res.sendFile(path.join(path.resolve(), "views", "tutorials.html"));
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
