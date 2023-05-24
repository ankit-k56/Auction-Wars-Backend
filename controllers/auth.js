const User = require('../models/User')
require('dotenv').config()
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const login = async(req, res) =>{
    const { email, password } = req.body;
    if(!email || !password){
        res.status(400).send("Email or password not provided")
    }
    const user = await User.findOne({email})
    const token = jwt.sign({email, password}, process.env.SECRET, {expiresIn: '30d'})
    res.status(200).json({user, token});
    
    // res.send("Hi")
   
}
const register = async(req, res)=>{
    const {email, password, name} = req.body;
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt )
    const user = await User.create({email, password: hashedPassword, name});
    const token = jwt.sign({email, password: hashedPassword, name}, process.env.SECRET, {expiresIn: '30d'});
    res.json({token, user});

}
module.exports = {login, register}