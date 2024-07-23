const express = require("express");
const dotenv = require("dotenv");
const Razorpay = require("razorpay");
const shortId = require('shortid');

dotenv.config();

const {PUBLIC_RAZORPAY_KEY, PRIVATE_RAZORPAY_SECRET, WEBHOOK_PAYMENT_VERIFICATION_SECRET} = process.env;

var razorPayInstance = new Razorpay({   
    key_id: PUBLIC_RAZORPAY_KEY,
    key_secret: PRIVATE_RAZORPAY_SECRET
});

const paymentHandler = async function(req,res){
    const amount= 500;
    const currency = 'INR';
    const payment_capture = 1;
    try{
        const options = {
            amount: amount * 100,
            currency: currency,
            receipt: shortId.generate(), //random id
            payment_capture: payment_capture
        }
        // you create an order -> you are telling your payment gateway that some user 
        // is going to pay in a bit  of time 
        const orderObject = await razorPayInstance.orders.create(options);
        res.status(200).json({
            status: 'success',
            message: {
                id: orderObject.id,
                amount: orderObject.amount,
                currency: orderObject.currency
            }
        })
    } catch(err){
        res.status(500).json({
            status:'failure',
            message: err.message
        })
    }
}

const verificationHandler = async function(req,res){
    try {
        console.log("freshSignature, razorPaySign");
        console.log(req.body);

        // this object -> sha256+webhook_secret
        const shasum = crypto.createHmac("sha256", WEBHOOK_PAYMENT_VERIFICATION_SECRET);
        shasum.update(JSON.stringify(req.body));
        const freshSignature = shasum.digest("hex");
        const razorPaySign = req.headers["x-razorpay-signature"];
        // console.log(req.headers);;
        console.log(freshSignature, razorPaySign);
        if (freshSignature == razorPaySign) {
            // ok
            console.log("Payment is verified", req.body);
            res.status(200).json({
                message: "OK",
            });
        } else {
            // there some tempering 
            res.status(403).json({ message: "Invalid" });
        }

    } catch (err) {
        res.status(500).json({
            status: "failure",
            message: err.message
        })
    }

}

module.exports = {paymentHandler,verificationHandler};