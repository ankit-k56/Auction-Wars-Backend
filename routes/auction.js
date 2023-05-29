const express = require('express')
const router = express.Router()
const { GetAllAuctions,GetAuction,DeleteAuction,PostAuction, UpdateAuction } = require('../controllers/auction')
router.route('/').get(GetAllAuctions).post(PostAuction)
router.route('/:id').get(GetAuction).patch(UpdateAuction).delete(DeleteAuction)
module.exports= router