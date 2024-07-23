const mongoose = require('mongoose');

const productSchemaRules = {
    name: {
        type: String,
        required: [true,"Kindly pass in product name"],
        unique: [true,"Product name should be unique"],
        maxlength: [40, "Your product length is more than 40 characters"]
    },
    brand: {
        type: String,
        required: [true, "Please Enter The brand name"]
    },
    price: {
        type: String,
        required: [true, "Kindy pass in product price"],
        validate: (function(){
            this.price > 0 
        }),
        message: "Price should be greater than 0"
    },
    categories: {
        type: [String],
        required: true,
    },
    productImages: {
        type: [String]
    },
    averageRating: Number,
    discount: {
        type: Number,
        validate: {
            validator: function () {
                return this.discount < this.price;
            },
            message: "Discount must be less than actual price",
        },
    },
    description: {
        type: String,
        required: [true, "Kindly add the description"],
        maxlength: [2000, "Description shouldn't be bigger then 2000 characters"]
    },
    stock_quantity: {
        type: String,
        required: [true, "You should enter stock of the product should be atleast 0"],
        validate: function () {
            return this.stock_quantity >= 0;
        },
        message: "stock_quantity should can't be negative "
    },
    reviews: {
        type: [mongoose.Schema.ObjectId],
        ref:"reviewModel"
    }
}

const productSchema = mongoose.Schema(productSchemaRules);

let validCategories = ['Electronics', "Audio", 'Clothing', 'Accessories',"Shoes","Fashion"];

productSchema.pre("save", function(next){
    const product = this;
    let invalidCategories = this.categories.filter((category)=>{
        return !validCategories.includes(category);
    })
    if(invalidCategories.length>0){
        const err = new Error(`Invalid Categories ${invalidCategories}`);
        next(err);
    }
    else {
        next();
    }

});


const productModel = mongoose.model("productModel",productSchema);

module.exports = productModel;