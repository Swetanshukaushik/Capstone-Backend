const mongoose = require('mongoose');

const bookingSchemaRules = {
    bookedAt: {
        type: Date,
        default: Date.now()
    },
    priceAtThatTime: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "failed", "sucess"],
        required: true,
        default: "pending"
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "userModel"
    },
    product: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "productModel"
    },
    payment_order_id: {
        type: String
    }
}

const bookingSchema = new mongoose.Schema(bookingSchemaRules);
const BookingModel = mongoose.model("bookingModel", bookingSchema);

module.exports = BookingModel;