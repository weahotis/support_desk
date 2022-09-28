const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

// @desc register a new user
// @route /api/users
// @access Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all field");
  }
  // find if user already exists
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400)  
    throw new Error("User already exists");
  }
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt); 

  // create user
  const user = await User.create({
    name,
    email,
    password: hashPassword
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};

// @desc login a new user
// @route /api/users/login
// @access Public
const loginUser = async(req, res) => {
  const {email, password}= req.body;
  const user = await User.findOne({email})

//   check user and password match
  if(user && (bcrypt.compare(password, user.password))){
    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      token: generateToken(user._id)  
    })
  }else{
    res.status(401)
    throw new Error("Invalid credentials")    
  }
};

// @desc Get user
// @route /api/users/me
// @access private   
const getMe = async(req, res)=>{
  const user = {
    id: req.user._id,
    email: req.user.email,
    name: req.user.name
  }
  res.status(200).json(user)
}
// generate token
const generateToken=(id)=>{
    return jwt.sign({id}, process.env.SECRET, {
        expiresIn : "20d"      
    })
}
module.exports = {
  registerUser,
  loginUser,
  getMe
};
