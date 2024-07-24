const express = require('express');
const authRouter = express.Router();
const {signupController, loginController,
    forgetPasswordController, resetPasswordController} = require("../controller/userManagementController")
const {getUserByIdHandler} = require("../controller/userController");
const {protectRouteMiddleware} = require('../controller/middleWares');

// console.log(typeof protectRouteMiddleware);
authRouter.post('/signup', signupController);
authRouter.post('/login', loginController);
authRouter.get('/allowIfLoggedIn', protectRouteMiddleware, getUserByIdHandler);
authRouter.patch('/forgetPassword', forgetPasswordController);
authRouter.patch('/resetPassword/:userID', resetPasswordController);

module.exports = authRouter;