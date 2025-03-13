const Coupon = require("../models/Coupon");

const abuseCheck = async (req, res, next) => {
  const userIP = req.ip;
  const cooldownTime = 60 * 60 * 1000; 

  const lastClaim = await Coupon.findOne({ claimedBy: userIP }).sort({ claimedAt: -1 });

  if (lastClaim && Date.now() - lastClaim.claimedAt < cooldownTime) {
    return res.status(429).json({
      message: `Wait ${Math.ceil((cooldownTime - (Date.now() - lastClaim.claimedAt)) / 60000)} minutes before claiming again.`,
    });
  }

  next();
};

module.exports = abuseCheck;
