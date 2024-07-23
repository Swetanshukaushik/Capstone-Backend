const mongoose = require('mongoose');
    
const userSchemaRules = {
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    password: {
        type: String,
        minlength: 8,
        required: true
    },
    // confirmPassword: {
    //     type: String,
    //     required: true,
    //     minlength: 8,
    //     validate: function () {
    //         return this.password === this. confirmPassword
    //     }
    // },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    bookings: {
        type: [mongoose.Schema.ObjectId],
        ref: "bookingModel"
    }
};

const userSchema = new mongoose.Schema(userSchemaRules);
userSchema.pre("save", async function (next) {
    const user = this;
    const password = user.password;
    const confirmPassword = user.confirmPassword;
    if (password == confirmPassword) {
        delete user.confirmPassword
        user.password = await bcrypt.hash(password, 10);
    } else {
        const err = new Error("Password and confirmPassword are not the same ")
        next(err)
    }
});

const UserModel = mongoose.model("userModel", userSchema);

module.exports = UserModel;
