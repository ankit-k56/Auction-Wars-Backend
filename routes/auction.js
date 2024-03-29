const express = require('express')
// const upload = require('../middleware/fileUpload')
const multer = require('multer')
const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })
const { GetAllAuctions,GetAuction,DeleteAuction,PostAuction,UpdateStatus,RegisterForAuction} = require('../controllers/auction')
router.route('/').get(GetAllAuctions).post(upload.single("photo"), PostAuction)
router.route('/:id').get(GetAuction).delete(DeleteAuction).post(RegisterForAuction).patch(UpdateStatus)
module.exports = router
// upload.single("photo")