const { Router } = require('express');
const apiController = require('../controllers/api.controller');


const apiRouter = Router();

apiRouter.post('/hh', apiController.apiHH);


module.exports = apiRouter;
