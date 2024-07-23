const ProductModel = require('./../model/ProductModel');
const { createFactory, getAllFactory, getByIdFactory, deleteByIdFactory } = 
require('./../utilities/CRUDFactory');
/******************products************************/
const createProductHandler = createFactory(ProductModel);
const getAllProductHandler = getAllFactory(ProductModel);
const getProductByIdHandler = getByIdFactory(ProductModel);
const deleteProductByIdHandler = deleteByIdFactory(ProductModel);

module.exports= {
    createProductHandler,
    getAllProductHandler,
    getProductByIdHandler,
    deleteProductByIdHandler
}