const express = require('express')
const router = express.Router()
const { GetAllAuctions,GetAuction,DeleteAuction,PostAuction,UpdateAuctionHighestBid, UpdateStatus} = require('../controllers/auction')
router.route('/').get(GetAllAuctions).post(PostAuction)
router.route('/:id').get(GetAuction).delete(DeleteAuction).patch(UpdateStatus)
module.exports = router