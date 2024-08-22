const express = require('express');
const dotEnv = require('dotenv');
dotEnv.config();
// const capProject = express();

// ------------------WEb Socket---------------
const http = require("http");
const capProject = express();
const app = http.createServer(capProject);
const socketIo = require('socket.io');
const io = new socketIo.Server(app);
// capProject.use(express.static('public'));

let room;
io.on('connection',function(socket){
    console.log("Socket "+ socket.id + " is connected");
    socket.broadcast.emit('message_from_BE_server', 'i am connected');

    socket.on('add_to_list_message', function(data){
        console.log(" on message VBE");
        socket.broadcast.emit("item_message_from_BE", data);
    })

    socket.on('create_group', function(currentRoom){
        room = currentRoom;
        console.log("group create at BE");
        socket.join(currentRoom);
    })

    socket.on('join_group', function(){
        console.log(socket.id + " joined the group");
        socket.join(room)
    })

    socket.on("group_message", function(data){
        socket.to(room).emit("serve_group_mesage", data);
    })
})


//-------------------------------------

const rateLimiter = require('express-rate-limit');
// capProject.use(rateLimiter);

const cors = require('cors');
// capProject.use(cors());
const corsConfig = {    //should NEVER be used, highly insecure
    origin: true,   //or specific url
    credentials: true,
};
// this is allowing all the requests
capProject.use(cors(corsConfig));
capProject.options('*', cors(corsConfig));

const helmet=require("helmet");
capProject.use(helmet());


const cookieParser = require('cookie-parser');

// const mongoose = require('mongoose');
const { PORT } = process.env;
// const dbURL = `mongodb+srv://${DB_USERNAME}:<${DB_PASSWORD}>@atlascluster.pydiaue.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster`;
// const dbURL = "mongodb+srv://swetanshu:swet1234@atlascluster.pydiaue.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster";

// const dbURL = `mongodb+srv://${DB_USERNAME}:<${DB_PASSWORD}>@atlascluster.pydiaue.mongodb.net/`

// mongoose.connect(dbURL)
//     .then(function (connection) { console.log("Connection to mongo establied") })
//     .catch(err => console.log(err))

/**********************connection to our DB********************************/
require("./utilities/connectWithDB");

const HOSTNAME = 'localhost';

const homeFuntion = function (req, res) {
    console.log('Home Page APth');
    res.status(200).json({
        status: 'success',
        message: "Welcons to home page"
    });
};

const serverStartFunction = function (port) {
    console.log(port);
    console.log("Server Started at port : ", PORT || 4000);
    // console.log(process.env);
};

const userRouter = require('./router/userRouter.js');
const productRouter = require('./router/productRouter.js');
const authRouter = require('./router/authRouter.js');
const paymentRouter = require('./router/paymentRouter.js');
const BookingRouter = require("./router/bookingRouter");
const ReviewRouter = require("./router/ReviewRouter");


capProject.use(cookieParser());

capProject.use(express.json());
const mongoSanitize = require('express-mongo-sanitize');    //to be used only after express.json() functn use
capProject.use(mongoSanitize());

capProject.use('/home', homeFuntion);
capProject.use('/api/user', userRouter);
capProject.use('/api/product', productRouter);
capProject.use('/api/auth', authRouter);
capProject.use('/api/payment', paymentRouter);
capProject.use("/api/booking", BookingRouter);
capProject.use("/api/review",ReviewRouter);

capProject.use(function (req, res) {
    console.log("Route not found");
    res.status(500).json({
        status: 'failure',
        message: 'Route now found'
    });
});

capProject.listen(PORT || 4000, serverStartFunction);
