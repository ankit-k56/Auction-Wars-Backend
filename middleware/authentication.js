const jwt = require('jsonwebtoken')
require('dotenv').config()
const authenticate = async(req, res, next)=>{
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1]
    try{
        const verify = jwt.verify(token, process.env.SECRET)
        req.user = {id:verify.id}
        next();
    }catch(error){
        res.status(200).send(error)
    }
    
}
module.exports = authenticate