const { Router } = require('express');
const helperController = require('../controllers/helper.controller');

const helperRouter = Router();

helperRouter.get('/result/:id', helperController.getOneResult);

helperRouter.get('/report/:id', helperController.getOneReport);

module.exports = helperRouter;
