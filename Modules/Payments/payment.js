const express = require("express");
const dotenv = require("dotenv");
const Razorpay = require("razorpay");

const app = express();
dotenv.config();
const {PUBLIC_RAZORPAY_KEY, PRIVATE_RAZORPAY_SECRET} = process.env;

var razorPayInstance = new Razorpay({   
    key_id: PUBLIC_RAZORPAY_KEY,
    key_secret: PRIVATE_RAZORPAY_SECRET
});











app.listen(3000,function(){
    console.log("app staterd");
})