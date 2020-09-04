const { validationResult } = require('express-validator');
const NoPanData = require('../Models/noPanData');

exports.getNoPanData = (req, res, next) => {
    NoPanData.find()
        .then((data) => {
            res.status(200).json({ message: "Vendors with no pan data in DB Fetched", data: data });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.createNoPanData = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const { name, email, phone, pan_no } = req.body;
    const noPanData = new NoPanData({
        name, email, phone, pan_no
    });
    noPanData.save()
        .then((result) => {
            res.status(200).json({ message: "Person created successfully", data: result });
        }).catch((error) => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
}

exports.checkNoPanOrNot = (req, res, next) => {
    const pan_no = req.params.id;
    NoPanData.find({ pan_no: pan_no })
        .then((result) => {
            if (result.length > 0) {
                res.status(200).json({ message: "Person already submitted", data: true });
            }
            else {
                res.status(200).json({ message: "No such person", data: false });
            }
        })
        .catch((error) => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
}