const express = require("express");
const { claimCoupon } = require("../controllers/couponController");
const abuseCheck = require("../middleware/abuseCheck");

const router = express.Router();

router.get("/claim", abuseCheck, claimCoupon);

module.exports = router;
