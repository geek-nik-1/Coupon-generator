const Coupon = require("../models/Coupon");

exports.claimCoupon = async (req, res) => {
  try {
    let userIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress; 

    if (userIP.includes(",")) {
      userIP = userIP.split(",")[0]; 
    }

    console.log("User IP:", userIP); 

    const coupon = await Coupon.findOneAndUpdate(
      { isClaimed: false },
      { isClaimed: true, claimedBy: userIP, claimedAt: new Date() },
      { new: true }
    );

    if (!coupon) return res.status(404).json({ message: "No coupons available." });

    res.cookie("claimed", true, { maxAge: 60 * 60 * 1000 }); // 1 hour cookie
    res.json({ message: `You got coupon: ${coupon.code}` });

  } catch (error) {
    console.error("Error claiming coupon:", error);
    res.status(500).json({ message: "Server error, try again later." });
  }
};
