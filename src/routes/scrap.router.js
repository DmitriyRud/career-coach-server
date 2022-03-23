const { Router } = require('express');
const scrapController = require('../controllers/scrap.controller');


const scrapRouter = Router();

scrapRouter.post('/hh', scrapController.scrapHH);


module.exports = scrapRouter;
