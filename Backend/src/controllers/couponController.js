const Coupon = require("../models/Coupon");

exports.claimCoupon = async (req, res) => {
  try {
    let userIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (userIP.includes(",")) userIP = userIP.split(",")[0]; 
    console.log("User IP:", userIP);

    const cooldownTime = 5 * 60 * 1000; 
    const lastClaim = await Coupon.findOne({ claimedBy: userIP }).sort({ claimedAt: -1 });

    if (lastClaim && Date.now() - lastClaim.claimedAt < cooldownTime) {
      const timeRemaining = Math.ceil((cooldownTime - (Date.now() - lastClaim.claimedAt)) / 1000);
      return res.status(429).json({ message: `Wait ${Math.floor(timeRemaining / 60)}m ${timeRemaining % 60}s before claiming again.`, timeRemaining });
    }

    const coupon = await Coupon.findOneAndUpdate(
      { isClaimed: false },
      { isClaimed: true, claimedBy: userIP, claimedAt: new Date() },
      { new: true }
    );

    if (!coupon) return res.status(404).json({ message: "No coupons available." });

    res.cookie("claimed", true, { maxAge: cooldownTime });
    res.json({ message: `You got coupon: ${coupon.code}`, timeRemaining: cooldownTime / 1000 });

  } catch (error) {
    console.error("Error claiming coupon:", error);
    res.status(500).json({ message: "Server error, try again later." });
  }
};
