const express = require('express');
const UserRouter = express.Router();
const {protectRouteMiddleware} = require("./../controller/middleWares")

const {getAllUserHandler, createUserHandler, getUserByIdHandler, deleteUserByIdHandler} = require('./../controller/userController');
const checkCreateInput = require('./../controller/middleWares');

UserRouter.get('/', getAllUserHandler);
UserRouter.post("/create", createUserHandler);
UserRouter.get('/:userId', protectRouteMiddleware ,getUserByIdHandler);
UserRouter.delete('/:userId', deleteUserByIdHandler);

module.exports = UserRouter;
