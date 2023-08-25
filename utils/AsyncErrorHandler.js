// const customApiError = require('../errors/custom-api-error')
const AsyncErrorHandler = (func)=>{
    return (req,res,next)=>{
        func(req,res,next).catch((err)=>next(err))
    }
}
module.exports = AsyncErrorHandler