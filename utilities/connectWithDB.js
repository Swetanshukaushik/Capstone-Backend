const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const { DB_PASSWORD, DB_USER } = process.env;

const dbURL = "mongodb+srv://swetanshu:swet1234@atlascluster.pydiaue.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster";
// once 
mongoose.connect(dbURL)
    .then(function (connection) {
        console.log("connected to db");
    }).catch(err => console.log(err))