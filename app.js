require("dotenv").config();
require("./database/database").connect()
const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const User = require("./model/user")
const auth = require("./middlewares/auth")

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("<h1>Server is running</h1>")
});

app.post("/register", async (req, res) => {
  try {

    const { email, password } = req.body;
    if (!(email || password)) {
        res.status(400).json({data: "All fields are required"})
    };

    const existingUser = await User.findOne({ email })
    if(existingUser) {
        res.status(400).json({data: "User already exists"})
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = User.create({
        email,
        password: hashPassword
    })
    const token = jwt.sign({id: newUser._id}, process.env.SECRET_KEY || "defaultsecrectkey", {
        expiresIn: "2h"
    })

    newUser.token = token
    
    res.status(201).json({data: "User created", newUser})

  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;
    if (!(email || password)) {
        res.status(400).json({data: "All fields are required"})
    };

    const user = await User.findOne({ email })

    if(!(user && bcrypt.compare(password, user.password))) {
        res.status(400).json({data: "Invalid details"})
    }

    const token = jwt.sign({id: user._id}, process.env.SECRET_KEY || "defaultsecrectkey", {
        expiresIn: "2h"
    })
    user.password
    user.token = token
    
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true
    }

    res.status(200).cookie("token", token, options).json({data: "User logined", user})

  } catch (error) {
    console.log(error);
  }
});


app.get("/dashboard", auth, (req, res) => {
  res.send(`Welcome to dashboard user ${req.id}`)
})

module.exports = app;
