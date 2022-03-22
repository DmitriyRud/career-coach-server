const { Router } = require('express');
const recomController = require('../controllers/recom.controller');


const recomRouter = Router();

recomRouter.post('/', recomController.addRecom);


module.exports = recomRouter;
