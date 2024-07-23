const express = require('express');
const userManagementRouter = express.Router();
const {signupController, loginController,
    forgetPasswordController, resetPasswordController} = require("./../controller/userManagementController")
const {getUserByIdHandler} = require("./../controller/userController");
const {protectRouteMiddleware} = require('./../controller/middleWares');

// console.log(typeof protectRouteMiddleware);
userManagementRouter.post('/signup', signupController);
userManagementRouter.post('/login', loginController);
userManagementRouter.get('/allowIfLoggedIn', protectRouteMiddleware, getUserByIdHandler);
userManagementRouter.patch('/forgetPassword', forgetPasswordController);
userManagementRouter.patch('/resetPassword/:userID', resetPasswordController);

module.exports = userManagementRouter;


