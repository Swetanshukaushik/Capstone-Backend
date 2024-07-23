const dotenv = require("dotenv"); 
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");    
const promisify = require("util").promisify;
const promisifiedJWTSign = promisify(jwt.sign);
const promisifiedJWTVerify = promisify(jwt.verify);

const checkCreateInput = (req, res, next) => {
    const elementDetails = req.body;
    const isEmpty = Object.keys(elementDetails).length === 0;
    if(isEmpty){
        res.status(400).json({
            status: 'failure',
            message: 'Create details empty'
        });
        next();
    } else {
        next();
    }
}

const protectRouteMiddleware = async (req, res, next) => {
    console.log("Hey tehre");
    try{
        const jwtToken = req.cookies.JWT;
        let decryptedToken = await promisifiedJWTVerify(jwtToken, JWT_SECRET);
        if(decryptedToken){
            let userId = decryptedToken.id;
            req.userId = userId;
            next();
        }
    }catch(err){
        res.status(500).json({
            status:'failure',
            message: err.message
        })
    }
}


module.exports = {checkCreateInput, protectRouteMiddleware: protectRouteMiddleware};