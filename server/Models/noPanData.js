const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noPanDataSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    pan_no: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('NoPanData', noPanDataSchema);