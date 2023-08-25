const User = require('../models/User')
require('dotenv').config()
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UnAuthenticated = require('../errors/unauthenticated')
const NotFoundError = require('../errors/not-found')
const Badrequest = require('../errors/bad-request')
const asyncErrorHandler = require('../utils/AsyncErrorHandler')

const login = asyncErrorHandler(  async(req, res) =>{
    const { email, password } = req.body;
    if(!email || !password){
        throw new Badrequest('Email or password not provided')
    }
    const user = await User.findOne({email})
    if(!user){
        throw new NotFoundError('User not found')
    }
    const isPasswordcorrect = await bycrypt.compare(password, user.password)
    if(!isPasswordcorrect){
        throw new UnAuthenticated('Not authenticated Kid')
    }
    const token = jwt.sign({id:user._id, name:user.name}, process.env.SECRET, {expiresIn: '30d'})
    
    res.status(200).json({user, token});
       
})

const register = asyncErrorHandler( async(req, res)=>{
    const {email, password, name, address} = req.body;
    if(!email||!password||!name||!address){
        throw new Badrequest('required field not provided')
    }
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt )
    const user = await User.create({email, password: hashedPassword, name, address});
    const token = jwt.sign({id:user._id, name:user.name}, process.env.SECRET, {expiresIn: '30d'});
    res.status(200).json({user,token});

})
const getUser = asyncErrorHandler(async(req,res)=>{
    const id = req.user.id;
    const user = await User.findById(id).populate('postedAuctions').populate('auctionsWon')
    if(!user){
        throw new NotFoundError('User not found')
    }
    res.status(200).json({user})

})
module.exports = {login, register, getUser}