const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async(req, res, next)=>{
    let token;
    // check for token in the header
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1]
            // verify token
            const decoded = jwt.verify(token, process.env.SECRET)
            // Get user from token
            // -password to stop the password from coming from the database
            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch (error) {
            console.log(error)  
           return res.status(401).json({error: 'Not Authorized'})
        } 
    }
    if(!token){
        res.status(401).json({error: 'Not Authorized'});
    }

}

module.exports = {protect}