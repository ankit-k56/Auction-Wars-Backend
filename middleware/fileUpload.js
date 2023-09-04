// const multer = require('multer')
// const path = require('path')
// const { v4: uuidv4 } = require('uuid');
// const storage = multer.diskStorage({
//     destination:(req, file, cb)=>{
//         cb(null , './public')
//     },
//     filename:(req,file,cb)=>{
//         cb(null, uuidv4() + path.extname(file.originalname) )
//     }
// })

// const upload = multer({
//     storage:storage,
// })

// module.exports = upload