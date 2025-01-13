const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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

        res.status(200).json({message:'User login success'});

    } catch (err) {
        console.log("Error during login:", err);
        res.status(500).json({ message: 'An error occured during login.'});
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




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

