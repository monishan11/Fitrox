const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "J^~4b!8L_.AW-sgH7y3vZ+TpR!cNwE2p";
const path = require("path")
const app = express();
const port = 3000;

const User = require('../model/user');


app.use(express.json()); // For parsing JSON data
app.use(express.urlencoded({ extended: true }));
app.use("/css",express.static(__dirname+"/css"))
app.use("/img",express.static(__dirname+"/img"))
console.log(__dirname);


// MongoDB connection
const mongoURI = 'mongodb+srv://admin:admin@users.hj0kt.mongodb.net/?retryWrites=true&w=majority&appName=users'; 
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB:', err));
const conn = mongoose.connection;

// Middleware
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


app.get("/",(req,res) => {
    res.sendFile(path.join(path.resolve(),"views","login.html"))
})
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(400).json({message:"No user found with this email."});
        }

        console.log("User found:", user);

        if(user.password !== password){
            return res.status(400).json({message:"Invalid password."});
            
        }
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: "Login successful", token, user });

    } 
    catch (err) {
        console.log("Error during login:", err);
        res.status(500).json({ message: 'Server Error'});
    }
});


// Check User Fields Route
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


// Save Additional Data
app.post('/save-data', verifyToken, async (req, res) => {
    const { age, gender, height, weight, selectedGoal } = req.body;
    try {
        const user = await User.findByIdAndUpdate(req.user.id, { age, gender, height, weight, selectedGoal }, { new: true });
        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});


app.get("/register", (req,res) => {
    res.sendFile(path.join(path.resolve(),"views","signup.html"))
})
app.post('/register', async (req, res) => {
    const { f_name, l_name, mobile, email, password } = req.body;
   
    try {
        const user = new User({ f_name, l_name, mobile, email, password });
        await user.save();
        console.log("user created");
        res.status(201).json({message:'User registered successfully'});

    } catch (err) {
        res.status(500).send({ message: 'Error registering user', error: err.message });
    }
});
app.get("/redirect",(req,res) => {
    res.sendFile(path.join(path.resolve(),"views","login.html"))
})


app.get("/init-frame1",(req,res) => {
    res.sendFile(path.join(path.resolve(),"views","init-frame1.html"))
})

app.get("/next-page",(req,res) => {
    res.sendFile(path.join(path.resolve(),"views","next-page.html"))
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

