const express = require('express');
const { body } = require('express-validator');
const noPanDataController = require('../Controllers/noPanData');

const Router = express.Router();

Router.get('/get-vendors-with-no-pan', noPanDataController.getNoPanData);
Router.post('/create-vendors-with-no-pan', noPanDataController.createNoPanData);
Router.get('/check-new-pan-or-not/:id', noPanDataController.checkNoPanOrNot);

module.exports = Router;