const express = require("express");
const BookingRouter = express.Router();
const BookingModel = require("../model/BookingModel");
const UserModel = require("../model/UserModel");
const {protectRouteMiddleware} = require('./../controller/middleWares');
const { PUBLIC_RAZORPAY_KEY, PRIVATE_RAZORPAY_SECRET, WEBHOOK_PAYMENT_VERIFICATION_SECRET } = process.env;
const Razorpay = require("razorpay");

const razorPayInstance = new Razorpay({
    key_id: PUBLIC_RAZORPAY_KEY,
    key_secret: PRIVATE_RAZORPAY_SECRET
});

const getAllBookings = async (req, res) => {
    try {
        const allBookings = await BookingModel.find()
            .populate({ path: "user", select: "name email" })
            .populate({ path: "product", select: "name  brand productImages" })
        res.status(200).json({
            status: "success",
            message: allBookings
        })
    } catch (err) {
        res.status(500).json({
            status: "failure",
            message: err.message
        })
    }

}

const verifyPaymentController = async function (req, res) {
    try {
        // this object -> sha256+webhook_secret
        const shasum = crypto.createHmac("sha256", WEBHOOK_SECERET);
        shasum.update(JSON.stringify(req.body));
        const freshSignature = shasum.digest("hex");
        const razorPaySign = req.headers["x-razorpay-signature"];
        // console.log(req.headers);;
        console.log("new verfy");
        if (freshSignature == razorPaySign) {
            // ok
            console.log("Payment is verified", req.body);
            const orderId = req.body.payload.payment.entity.order_id;
            const bookingObject = await
                BookingModel.findOne({ payment_order_id: orderId });
            // your poayment has been done 
            bookingObject.status = "sucess";
            delete bookingObject.payment_order_id
            await bookingObject.save();
            // 
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

const initialBookingController = async (req, res) => {
    const userId = req.body.userId;
    const { priceAtThatTime } = req.body;
    const { productId } = req.params;
    const status = "pending";
    console.log(userId);
    try {
        //create a booking document
        const bookingObject = await BookingModel.create({
            user: userId,
            product: productId,
            priceAtThatTime: priceAtThatTime,
            status: status
        })
        const userObject = await UserModel.findById(userId);
        userObject.bookings.push(bookingObject["_id"])
        await userObject.save();

        //initiating the payment
        const amount = bookingObject.priceAtThatTime;
        const currency = "INR";
        const payment_capture = 1;
        const options = {
            amount: amount * 100,
            currency: currency,
            receipt: bookingObject["_id"],
            payment_capture: payment_capture
        }
        // you create an order -> you are telling your payment gateway that some user is going to pay in a bit of time 
        const orderObject = await razorPayInstance.orders.create(options);
        bookingObject.payment_order_id = orderObject.id;
        await bookingObject.save();
        // send the order it to frontend 
        res.status(200).json({
            status: "success",
            message: {
                id: orderObject.id,
                currency: orderObject.currency,
                amount: orderObject.amount
            }
        })
    } catch (err) {
        res.status(500).json({
            status: "failure",
            message: err.message
        })
    }
};

BookingRouter.get("/", getAllBookings);
BookingRouter.post('/:productId', initialBookingController);
BookingRouter.post("/verify", verifyPaymentController);

module.exports = BookingRouter;


