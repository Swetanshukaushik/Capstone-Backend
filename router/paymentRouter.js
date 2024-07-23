const express = require('express');
const paymentRouter = express.Router();

const {paymentHandler,verificationHandler} = require('./../controller/paymentController.js');



paymentRouter.post('/pay', paymentHandler);
paymentRouter.post('/verification', verificationHandler);


module.exports = paymentRouter; //deprecated by bookingRouter