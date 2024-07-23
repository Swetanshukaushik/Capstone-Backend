const express = require('express');
const productRouter = express.Router();
const {getProductByIdHandler, createProductHandler, deleteProductByIdHandler} 
    = require('./../controller/productController');
const productModel = require('../model/ProductModel');

const getAllProductHandler = async function(req,res){
    try{
        const query = req.query;
        const selectQuery = query.select;
        const sortQuery = query.sort;
        const limit= query.limit;

        let productQueryResponsePromies = productModel.find();
        if(sortQuery){
            let sortParam = sortQuery.split("")[0];
            let sortOrder = sortQuery.split("")[1];
            if(sortOrder == "inc"){
                productQueryResponsePromies = productQueryResponsePromies.sort(sortParam);
            }else {
                productQueryResponsePromies = productQueryResponsePromies.sort(-sortParam);
            }
        }
        if(selectQuery){
            productQueryResponsePromies = productQueryResponsePromies.select(selectQuery);
        }
        if(limit){
            productQueryResponsePromies = productQueryResponsePromies.limit(limit);
        }
        
        const result = await productQueryResponsePromies;
        res.status(200).json({
            status:'success',
            message: result
        });
    } catch (err){
        res.status(500).json({
            status: 'failure',
            message: err.message
        });
    }

}

productRouter.get('/', getAllProductHandler);
productRouter.get('/:productId', getProductByIdHandler);
productRouter.post('/create', createProductHandler);
productRouter.delete('/:productId', deleteProductByIdHandler);


module.exports = productRouter;


