const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vendorSchema = new Schema({
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },
    status: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        // required: true
        // default: ""
    },
    company_code: {         //6 digit
        type: String,
        // required: true
        // default: ""
    },
    vendor_code: {
        type: String,
        // required: true
        // default: ""
    },
    gst_no: {
        type: String,
        // required: true,
        // default: ""
    },
    gst_attachment: {
        type: String,
        // required: true,
        // default: ""
    },
    pan_no: {
        type: String,
        // required: true,
        // default: ""
    },
    pan_attachment: {
        type: String,
        // required: true,
        // default: ""
    },
    phone_number: {
        type: String,
        // required: true,
        // default: ""
    },
    email: {
        type: String,
        // required: true,
        // default: ""
    },
    type_of_organization: {
        type: String,
        // required: true,
        // default: ""
    },
    address_line1: {
        type: String,
        // required: true
        // required: true,
        // default: ""
    },
    address_line2: {
        type: String,
        // default: ""
    },
    address_line3: {
        type: String,
        // default: ""
    },
    city: {
        type: String,
        // required: true,
        // default: ""
    },
    state: {
        type: String,
        // required: true,
        // default: ""
    },
    pin_code: {
        type: String,
        // required: true,
        // default: "000000"
    },
    is_msme: {
        type: String,
        // required: true,
        // default: "N"
    },
    turnover: {
        type: Boolean,
        default: false
    },
    msme_reg_no: {
        type: String,
        // required: true,
        // default: ""
    },
    msme_valid_from: {
        type: Date,
        // required: true
        // default: null
    },
    msme_attachment: {
        type: String,
        // required: true,
        // default: ""
    },
    contact_person_name: {
        type: String,
        // required: true,
        // default: ""
    },
    accounts_head_name: {
        type: String,
        // required: true,
        // default: ""
    },
    accounts_head_email: {
        type: String,
        // required: true,
        // default: ""
    },
    accounts_head_mobile: {
        type: String,
        // required: true,
        // default: ""
    },
    bank_account_no: {
        type: String,
        // required: true,
        // default: ""
    },
    bank_name: {
        type: String,
        // required: true,
        // default: ""
    },
    bank_account_type: {        //current,saving,cash credit,overdraft,others
        type: String,
        // required: true,
        // default: ""
    },
    bank_ifsc: {
        type: String,
        // required: true,
        // default: ""
    },
    bank_cancelled_cheque: {
        type: String,
        // required: true,
        // default: ""
    },
    email_confirmed: {
        type: Boolean,
        default: false
    },
    phone_confirmed: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);