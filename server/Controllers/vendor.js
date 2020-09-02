const { validationResult } = require('express-validator');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Vendor = require('../Models/vendor');
const { distinct } = require('../Models/vendor');

exports.getVendors = (req, res, next) => {
    Vendor.find()
        .then((vendors) => {
            res.status(200).json({ message: "Vendors Fetched", vendors: vendors });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.getSpecificVendor = (req, res, next) => {
    const vendorId = req.params.id;
    Vendor.findById(vendorId)
        .then((vendor) => {
            if (!vendor) {
                const error = new Error('Could not find vendor.');
                error.status = 404;
                throw error;
            }
            res.status(200).json({ message: "Vendor fetched", vendor: vendor });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.gstVerifiedOrNot = (req, res, next) => {
    const gst_no = req.body.gst_no;
    Vendor.find({ gst_no: gst_no })
        .then((vendors) => {
            if (!vendors) {
                const error = new Error('Could not find any vendor.');
                error.status = 404;
                throw error;
            }
            let data = false;
            let vendorId = "";
            vendors.map((vendor) => {
                if (vendor.phone_confirmed && vendor.email_confirmed) {
                    data = true;
                    vendorId = vendor._id;
                }
            })
            res.status(200).json({ message: "Vendors fetched", length: vendors.length, data: data, vendor: vendorId });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.getVendorsByPANCard = (req, res, next) => {
    const panCardNo = req.params.id;
    Vendor.find({ pan_no: panCardNo })
        .then((vendors) => {
            const unique = [...new Map(vendors.map(item =>
                [item["gst_no"], item])).values()];
            res.status(200).json({ message: "Vendors Fetched", length: unique.length, vendors: vendors, unique: unique });
        })
        .catch((err) => {
            if (!err.status) {
                err.status = 500;
            }
            next(err);
        })
}

exports.getVendorsByPANAndGST = (req, res, next) => {
    const gstNumber = req.body.gst_no;
    const query = {
        gst_no: gstNumber,
        status: true
    };
    Vendor.find(query)
        .then((vendors) => {
            if (vendors.length == 0) {
                const error = new Error('Validation failed, entered query has no data.');
                error.statusCode = 404;
                throw error;
            }
            else {

            }
        })
        .catch((error) => {
            if (!error.status) {
                error.status = 500;
            }
            next(error);
        })
}

exports.createVendors = (req, res, next) => {
    const vendorsData = req.body.data;
    Vendor.insertMany(vendorsData)
        .then((vendors) => {
            console.log(vendors)
            res.status(200).json({ message: "Vendors added", vendors: vendors });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.createVendor = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    if (!req.files) {
        const error = new Error('No files provided');
        error.statusCode = 422;
        throw error;
    }


    const { name,
        company_code,
        vendor_code,
        gst_no,
        pan_no,
        phone_number,
        email,
        type_of_organization,
        address_type,
        address_line1,
        address_line2,
        address_line3,
        city, state, pin_code,
        is_msme, msme_reg_no, msme_valid_from, turnover,
        bank_ifsc, bank_account_type, bank_name, bank_account_no,
        accounts_head_mobile, accounts_head_email, accounts_head_name,
        contact_person_mobile, contact_person_email, contact_person_name,
    } = req.body;
    const { pan_attachment, msme_attachment, gst_attachment, bank_cancelled_cheque } = req.files;
    // console.log(req.files)

    const vendor = new Vendor({
        name,
        company_code,
        vendor_code,
        gst_no,
        pan_no,
        phone_number,
        email,
        type_of_organization,
        address_type,
        address_line1,
        address_line2,
        address_line3,
        city, state,
        pin_code,
        is_msme,
        turnover,
        msme_reg_no, msme_valid_from,
        bank_ifsc, bank_account_type, bank_name, bank_account_no,
        accounts_head_mobile, accounts_head_email, accounts_head_name,
        contact_person_mobile, contact_person_email, contact_person_name,
        pan_attachment: pan_attachment[0].path,
        gst_attachment: gst_attachment[0].path,
        msme_attachment: msme_attachment[0].path,
        bank_cancelled_cheque: bank_cancelled_cheque[0].path
    });

    vendor.save().then((result) => {
        res.status(200).json({ message: "Vendor created successfully", vendor: vendor });
    }).catch((error) => {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    })
}

exports.deleteVendor = (req, res, next) => {
    const vendorId = req.params.id;
    Vendor.findById(vendorId)
        .then((vendor) => {
            if (!vendor) {
                const error = new Error('Could not find vendor.');
                error.status = 404;
                throw error;
            }
            return Vendor.findByIdAndRemove(vendorId);
        })
        .then(result => {
            res.status(200).json({ message: "Deleted vendor successfully!" });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.updateOrganizationDetails = (req, res, next) => {
    const vendorId = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const {
        type_of_organization,
        is_msme,
        turnover,
        msme_reg_no,
        msme_valid_from,
        address_line1,
        address_line2,
        address_line3,
        city,
        state,
        pin_code
    } = req.body;
    Vendor.findById(vendorId)
        .then((vendor) => {
            if (!vendor) {
                const error = new Error('Could not find vendor.');
                error.status = 404;
                throw error;
            }
            vendor.type_of_organization = type_of_organization;
            vendor.address_line1 = address_line1;
            vendor.address_line2 = address_line2;
            vendor.address_line3 = address_line3;
            vendor.city = city;
            vendor.state = state;
            vendor.pin_code = pin_code;
            vendor.turnover = turnover;
            vendor.is_msme = is_msme;
            vendor.msme_reg_no = msme_reg_no;
            vendor.msme_valid_from = msme_valid_from;
            return vendor.save();
        }).then((result) => {
            res.status(200).send({ message: "Vendor organization details updated successfully!", vendor: result });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
}

exports.updateAccountDetails = (req, res, next) => {
    const vendorId = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const {
        accounts_head_email,
        accounts_head_mobile,
        accounts_head_name,
        bank_account_no,
        bank_account_type,
        bank_ifsc,
        bank_name
    } = req.body;

    Vendor.findById(vendorId)
        .then((vendor) => {
            if (!vendor) {
                const error = new Error('Could not find vendor.');
                error.status = 404;
                throw error;
            }
            vendor.bank_account_no = bank_account_no;
            vendor.bank_account_type = bank_account_type;
            vendor.bank_ifsc = bank_ifsc;
            vendor.bank_name = bank_name;
            vendor.accounts_head_name = accounts_head_name;
            vendor.accounts_head_mobile = accounts_head_mobile;
            vendor.accounts_head_email = accounts_head_email;
            return vendor.save();
        })
        .then((result) => {
            res.status(200).send({ message: "Vendor account details updated successfully!", vendor: result });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
}

exports.updateVendorAttachments = (req, res, next) => {
    const vendorId = req.params.id;
    const { company_code, vendor_code, pan_no, gst_no, msme_reg_no } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    if (!req.files) {
        const error = new Error('No files provided');
        error.statusCode = 422;
        throw error;
    }
    const {
        pan_attachment,
        gst_attachment,
        msme_attachment,
        bank_cancelled_cheque
    } = req.files;
    Vendor.findById(vendorId)
        .then((vendor) => {
            if (!vendor) {
                const error = new Error('Could not find source vendor.');
                error.status = 404;
                throw error;
            }
            vendor.pan_attachment = pan_attachment[0].path;
            vendor.gst_attachment = gst_attachment[0].path;
            vendor.msme_attachment = msme_attachment ? msme_attachment[0].path : "";
            vendor.bank_cancelled_cheque = bank_cancelled_cheque[0].path;
            vendor.status = true;
            return vendor.save();
        })
        .then((result) => {
            res.status(200).send({ message: "Vendor attachments updated successfully!", vendor: result });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
}


exports.copyDataToMultipleVendors = (req, res, next) => {
    const pan = req.body.pan_no;
    const gst = req.body.gst_no;
    const vendorId = req.params.id;
    Vendor.find({ pan_no: pan, gst_no: gst })
        .then((result) => {
            const data = result.filter(item => item._id !== vendorId && !item.status);
            Vendor.findById(vendorId)
                .then((vendor1) => {
                    data.map((item) => {
                        item.phone_number = vendor1.phone_number;
                        item.email = vendor1.email;
                        item.type_of_organization = vendor1.type_of_organization;
                        item.address_type = vendor1.address_type;
                        item.address_line1 = vendor1.address_line1;
                        item.address_line2 = vendor1.address_line2;
                        item.address_line3 = vendor1.address_line3;
                        item.city = vendor1.city;
                        item.state = vendor1.state;
                        item.pin_code = vendor1.pin_code;
                        item.turnover = vendor1.turnover;
                        item.is_msme = vendor1.is_msme;
                        item.msme_reg_no = vendor1.msme_reg_no;
                        item.msme_valid_from = vendor1.msme_valid_from;
                        item.bank_account_no = vendor1.bank_account_no;
                        item.bank_account_type = vendor1.bank_account_type;
                        item.bank_ifsc = vendor1.bank_ifsc;
                        item.bank_name = vendor1.bank_name;
                        item.accounts_head_name = vendor1.accounts_head_name;
                        item.accounts_head_mobile = vendor1.accounts_head_mobile;
                        item.accounts_head_email = vendor1.accounts_head_email;
                        item.contact_person_name = vendor1.contact_person_name;
                        item.pan_attachment = vendor1.pan_attachment;
                        item.gst_attachment = vendor1.gst_attachment;
                        item.msme_attachment = vendor1.msme_attachment;
                        item.bank_cancelled_cheque = vendor1.bank_cancelled_cheque;
                        item.email_confirmed = true;
                        item.phone_confirmed = true;
                        item.status = true;
                        return item.save();
                    })
                })
            res.status(200).send({ message: "Vendor organization details updated successfully!", length: data.length, vendors: data });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
}

exports.copyVendors = (req, res, next) => {
    const source = req.body.source;
    const target = req.body.target;
    Vendor.findById(source)
        .then((vendor1) => {
            if (!vendor1) {
                const error = new Error('Could not find source vendor.');
                error.status = 404;
                throw error;
            }
            if (!vendor1.email_confirmed && !vendor1.phone_confirmed) {
                const error = new Error('Please verify your source email and phone to proceed.');
                error.status = 404;
                throw error;
            }
            Vendor.findById(target)
                .then((vendor2) => {
                    if (!vendor2) {
                        const error = new Error('Could not find destination vendor.');
                        error.status = 404;
                        throw error;
                    }
                    vendor2.phone_number = vendor1.phone_number;
                    vendor2.email = vendor1.email;
                    vendor2.type_of_organization = vendor1.type_of_organization;
                    vendor2.address_type = vendor1.address_type;
                    vendor2.address_line1 = vendor1.address_line1;
                    vendor2.address_line2 = vendor1.address_line2;
                    vendor2.address_line3 = vendor1.address_line3;
                    vendor2.city = vendor1.city;
                    vendor2.state = vendor1.state;
                    vendor2.pin_code = vendor1.pin_code;
                    vendor2.is_msme = vendor1.is_msme;
                    vendor2.msme_reg_no = vendor1.msme_reg_no;
                    vendor2.msme_valid_from = vendor1.msme_valid_from;
                    vendor2.bank_account_no = vendor1.bank_account_no;
                    vendor2.bank_account_type = vendor1.bank_account_type;
                    vendor2.bank_ifsc = vendor1.bank_ifsc;
                    vendor2.bank_name = vendor1.bank_name;
                    vendor2.accounts_head_name = vendor1.accounts_head_name;
                    vendor2.accounts_head_mobile = vendor1.accounts_head_mobile;
                    vendor2.accounts_head_email = vendor1.accounts_head_email;
                    vendor2.contact_person_name = vendor1.contact_person_name;
                    vendor2.pan_attachment = vendor1.pan_attachment;
                    vendor2.gst_attachment = vendor1.gst_attachment;
                    vendor2.msme_attachment = vendor1.msme_attachment;
                    vendor2.bank_cancelled_cheque = vendor1.bank_cancelled_cheque;
                    vendor2.email_confirmed = true;
                    vendor2.phone_confirmed = true;
                    vendor2.status = true;
                    return vendor2.save();
                })
                .then((result) => {
                    res.status(200).send({ message: "Vendor copied successfully!", vendor: result });
                })
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
}

exports.sendEmail = (req, res, next) => {
    const vendorId = req.params.id;
    const email = req.body.email;
    Vendor.findById(vendorId)
        .then(async (vendor) => {
            if (!vendor) {
                const error = new Error('Could not find vendor.');
                error.status = 404;
                throw error;
            }
            if (vendor.email_confirmed) {
                const error = new Error('Vendor already verified his/her email.');
                error.status = 404;
                throw error;
            }
            try {
                const emailToken = jwt.sign({ vendorId: vendorId, email: email }, 'thedollarappcredentials', { expiresIn: "1h" });
                let transporter = await nodemailer.createTestAccount((err, account) => {
                    let transporter = nodemailer.createTransport({
                        service: "Gmail",
                        auth: {
                            user: 'hrithik.agarwal87@gmail.com',
                            pass: 'lifeinnutshell4534',
                        },
                    });
                    const url = `http://localhost:5000/vendors/confirm-email/${emailToken}`;
                    const mailOptions = {
                        from: "'Khushal Agarwal' <hrithik.agarwal87@gmail.com>",
                        to: email,
                        subject: "Hello from Dollar Industries✔",
                        text: "Confirm Email",
                        html: `<h4>Please click on the link to confirm your email: <a href="${url}">${url}</a></h4>`,
                    }
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log("Message sent: %s", info.messageId);
                        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                    })
                });
            }
            catch (error) {
                console.log(error);
            }
        })
        .then((result) => {
            res.status(200).send({ message: "Email sent successfully!" });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
}

exports.confirmEmail = (req, res, next) => {
    const token = req.params.token;
    const { vendorId, email } = jwt.verify(token, 'thedollarappcredentials');
    Vendor.findById(vendorId)
        .then((vendor) => {
            if (!vendor) {
                const error = new Error('Could not find vendor.');
                error.status = 404;
                throw error;
            }
            if (!vendor.email_confirmed) {
                vendor.email_confirmed = true;
                vendor.email = email;
                return vendor.save();
            }
        })
        .then((result) => {
            res.status(200).send({ message: "Email confirmed successfully!" });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
}

exports.confirmPhone = (req, res, next) => {
    const vendorId = req.params.id;
    const phone = req.body.phone;
    const email = req.body.email;
    const name = req.body.name;
    Vendor.findById(vendorId)
        .then((vendor) => {
            if (!vendor) {
                const error = new Error('Could not find vendor.');
                error.status = 404;
                throw error;
            }
            if (!vendor.phone_confirmed && !vendor.email_confirmed) {
                vendor.phone_number = phone;
                vendor.phone_confirmed = true;
                vendor.email_confirmed = true;
                vendor.contact_person_name = name;
                vendor.email = email;
                return vendor.save();
            }
        })
        .then((result) => {
            res.status(200).send({ message: "Phone confirmed successfully!", vendor: result });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
}

exports.deleteAllVendors = (req, res, next) => {
    Vendor.deleteMany()
        .then((result) => {
            res.status(200).send({ message: "Deleted all vendors succesfully!" });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        })
}