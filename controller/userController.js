const {
    getByIdFactory,
    deleteByIdFactory,
    getAllFactory,
    createFactory
} = require('./../utilities/CRUDFactory');
const UserModel = require('../model/UserModel');

const getUserByIdHandler = getByIdFactory(UserModel);
const deleteUserByIdHandler = deleteByIdFactory(UserModel);
const getAllUserHandler = getAllFactory(UserModel);
const createUserHandler = createFactory(UserModel);

module.exports = {
    getUserByIdHandler,
    deleteUserByIdHandler,
    getAllUserHandler,
    createUserHandler
};
