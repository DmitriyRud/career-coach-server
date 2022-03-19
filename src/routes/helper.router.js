const { Router } = require('express');
const helperController = require('../controllers/helper.controller');

const helperRouter = Router();

helperRouter.get('/result/:id', helperController.getOneResult);

helperRouter.get('/report/:id', helperController.getOneReport);

helperRouter.post('/whitelist', helperController.addSkillWhiteList)
helperRouter.post('/blacklist', helperController.addSkillBlackList)
helperRouter.post('/userskill', helperController.addUserSkill)
helperRouter.post('/userplans', helperController.addSkillMyPlans)

module.exports = helperRouter;
