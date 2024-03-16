const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

// Define schema for user
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phno: String,
    password: String,
    gender: String,
    age: Number
});

// Define model for user
const User = mongoose.model('User', userSchema);

app.post("/sign_up", (req, res) => {
    const { name, email, phno, password, gender, age } = req.body;

    const newUser = new User({
        name,
        email,
        phno,
        password,
        gender,
        age
    });

    newUser.save((err, user) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error occurred while signing up");
        } else {
            console.log("User created successfully:", user);
            res.redirect('signup_success.html');
        }
    });
});

app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    res.sendFile(__dirname + '/index.html');
});

app.listen(3001, () => {
    console.log("Listening on PORT 3001");
});