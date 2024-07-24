const UserModel = require("../model/UserModel");
const cookieParser = require("cookie-parser");
const fs = require("fs");

const express = require("express"); //to do with cookies
const app = express();
app.use(cookieParser());

app.use(express.json()); //to add params to req.body
express.json()

const dotenv = require("dotenv"); 
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");    
const promisify = require("util").promisify;
const promisifiedJWTSign = promisify(jwt.sign);
const promisifiedJWTVerify = promisify(jwt.verify);
const bcrypt = require("bcrypt");

const otpGenerator = require("./../utilities/otpGenerator/otpGenerator");
const {sendEmailHelper} = require("./../utilities/EmailService/dynamicMailSender");


const signupController = async (req, res) =>{
    try {
        const userObject = req.body;
        let newUser = await UserModel.create(userObject);
        res.status(200).json({
            status: 'success',
            user: newUser,
            message: "New user created successfully"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message,
            status: "failed"
        });
    }
}

const loginController = async (req, res) => {
    try{
        const {emailId, password} = req.body;
        const user = await UserModel.findOne(emailId);
        console.log(user);
        if(user){
            const isAuthenticated = await bcrypt.compare(password, user.password);
            if(isAuthenticated){
                let token = await promisifiedJWTSign({id: user["_id"]}, JWT_SECRET);
                console.log("sending toker for login");
                res.cookie("JWT", token, {maxAge: 90000000, httpOnly: true, path: "/"});
                res.status(200).json({
                    status: "success",
                    message: {
                        name: user.name,
                        email: user.email
                    }
                })
            } else {
                console.log("Wrong password");
                res.status(500).json({
                    status: 'failer',
                    message: 'Wrong password'
                })
            }
        }
    } catch(err){
        console.log(err);
        res.status(500).json({
            message: err.message || 'Email or password incorrect !',
            status: "failed"
        })
    }
}

const forgetPasswordController = async(req, res) => {
    let {email} = req.body;
    let user = await UserModel.findOne({email: email});
    if(user){
        const otp = otpGenerator();
        const subject = "RESET PASSWORD Verification OTP";
        const otpTemplate = fs.readFileSync('utilities/otpGenerator/otp.html', 'utf-8');
        // const otpTemplate = fs.readFileSync('./../');
        console.log(user.name);
        console.log("user.name");


        // await sendEmailHelper(user.email, otpTemplate, otp, user.name, subject);
        user.token = otp;
        user.tokenExpiry = Date.now() + 1000 * 60 * 5; //5 mins
        await user.save();

        res.status(200).json({
            status:"success",
            message: "OTP sent to email id : " + email,
            userId: user.id,
            otp: otp
        });
    } else {
        res.status(404).json({
            status: "failure",
            message: "User with this email id does not exist !"
        })
    }
}

const resetPasswordController = async (req,res)=>{
    console.log('api recieved');
    try {
        const userId = req.body.userId;
        const {password, confirmPassword, otp} = req.body;
        const user = UserModel.findById(userId);

        if(user){
            if(otp && user.token === otp){
                let currentTime = Date.now();
                if(currentTime > user.tokenExpiry){
                    res.status(404).json({
                        status: "failure",
                        message: "otp is expired"
                    })
                }
            }
        }else {
                res.status(404).json({
                    status: "failure",
                    message: "otp is not found or wrong"
                })
            }

    } catch(err) {
        res.status(404).json({
            status: "failure",
            message: err.message
        })
    }
}


module.exports = {signupController, loginController, forgetPasswordController, resetPasswordController }