const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");



require("dotenv").config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const couponRoutes = require("./routes/couponRoutes");
const Coupon = require("./models/Coupon");


// async function a(){
// const newCoupon = new Coupon({ code: "TEST002", isClaimed: false });
// await newCoupon.save();
// }

// a()
app.use("/coupons", couponRoutes);

module.exports = app;
