const express = require('express');
const { body } = require('express-validator');
const vendorController = require('../Controllers/vendor');

const Router = express.Router();

Router.get('/get-vendors', vendorController.getVendors);
Router.get('/get-vendor/:id', vendorController.getSpecificVendor);
Router.get('/get-vendors-by-pan/:id', vendorController.getVendorsByPANCard);
Router.post('/get-vendors-by-gst-pan', vendorController.getVendorsByPANAndGST);
Router.post('/copy-vendors-by-gst-pan-id/:id', vendorController.copyDataToMultipleVendors);
Router.get('/check-vendors-confirmed-or-not', vendorController.gstVerifiedOrNot);
Router.get('/check-pan-status/:id', vendorController.checkIfPanStatusTrue);
Router.post('/create-vendor', [
    body('pan_no').trim().notEmpty().withMessage("PAN number cannot be empty")
], vendorController.createVendor);
Router.post('/create-vendors', vendorController.createVendors);     //to add data we use {data:[]} format
Router.put('/update-vendor-organization-details/:id', vendorController.updateOrganizationDetails);
Router.put('/update-vendor-account-details/:id', vendorController.updateAccountDetails);
Router.put('/update-vendor-attachments/:id', vendorController.updateVendorAttachments);
Router.put('/copy-vendor', vendorController.copyVendors);
Router.delete('/delete-vendor/:id', vendorController.deleteVendor);
Router.delete('/delete-all-vendors', vendorController.deleteAllVendors);
Router.get('/confirm-email/:token', vendorController.confirmEmail);
Router.post('/send-email/:id', vendorController.sendEmail);
Router.put('/confirm-phone/:id', vendorController.confirmPhone);
Router.get('/phone-confirmation/:id', vendorController.phoneVerification);

module.exports = Router;