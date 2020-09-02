const { v4: uuidv4 } = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const createError = require('http-errors');
const multer = require('multer');

const constants = require('./config/dev');

//App Routes
const vendorRoutes = require('./Routes/vendor');
const noPanDataRoutes = require('./Routes/noPanData');
// const productRoutes = require('./Routes/product');
// const authRoutes = require('./Routes/auth');
// const cartRoutes = require('./Routes/cart');
// const addressRoutes = require('./Routes/address');
// const orderRoutes = require('./Routes/order');

//App initialization
const app = express();


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        if (file.fieldname === "pan_attachment") {
            cb(null, req.body.company_code + "_" + req.body.vendor_code + "_" + req.body.pan_no + "_" + file.originalname);
        }
        else if (file.fieldname === "gst_attachment") {
            cb(null, req.body.company_code + "_" + req.body.vendor_code + "_" + req.body.gst_no + "_" + file.originalname);
        }
        else if (file.fieldname === "msme_attachment") {
            cb(null, req.body.company_code + "_" + req.body.vendor_code + "_" + req.body.msme_reg_no + "_" + file.originalname);
        }
        else if (file.fieldname === "bank_cancelled_cheque") {
            cb(null, req.body.company_code + "_" + req.body.vendor_code + "_" + "cheque_" + file.originalname);
        }
        else
            cb(null, req.body.company_code + "_" + req.body.vendor_code + "_" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png'
        || file.mimetype === 'image/jpg'
        || file.mimetype === 'image/jpeg'
        || file.mimetype === "application/pdf"
    ) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}


//App utilities
app.use(express.static(path.join(__dirname, 'Public')));
app.use(bodyParser.urlencoded({ extended: false }));    //x-www-form-urlencoded
app.use(bodyParser.json());         //application/json
app.use(multer({ storage: fileStorage, fileFilter: fileFilter })
    .fields([
        { name: "pan_attachment", maxCount: 1 },
        { name: "gst_attachment", maxCount: 1 },        //need to be done 5
        { name: "msme_attachment", maxCount: 1 },
        { name: "bank_cancelled_cheque", maxCount: 1 }
    ]));

app.use(cookieParser());


app.use('/images', express.static(path.join(__dirname, 'images')));

//To set cors header
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
})

app.use('/vendors', vendorRoutes);
app.use('/nopandata', noPanDataRoutes);


//Handling error and response
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
})


//Mongoose connection
//LOCAL URL - mongodb://localhost:27017/test

let port = 5000;
mongoose.connect(constants.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then((result) => {
        app.listen(port);
    }).then((res) => {
        console.log("Hey we are good to go");
    }).catch(error => {
        console.log(error);
    })

