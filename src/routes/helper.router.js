const { Router } = require('express');
const helperController = require('../controllers/helper.controller');

const helperRouter = Router();

helperRouter.get('/result/:id', helperController.getOneResult);
helperRouter.get('/result/user/:id', helperController.getUserAllResult);
helperRouter.get('/report/:id', helperController.getOneReport);
helperRouter.get('/recomendation/:id', helperController.getRecomendation);
helperRouter.get('/vacancies/:id', helperController.getVacanciesUser);

helperRouter.post('/whitelist', helperController.addSkillWhiteList);
helperRouter.get('/whitelist/:id', helperController.getAllFromWhiteList);
helperRouter.delete('/whitelist/:id', helperController.deleteFromWhiteList);
helperRouter.delete('/delete/whitelist', helperController.deleteAllWhiteList);

helperRouter.post('/blacklist', helperController.addSkillBlackList);
helperRouter.get('/blacklist/:id', helperController.getAllFromBlackList);
helperRouter.delete('/blacklist/:id', helperController.deleteFromBlackList);
helperRouter.delete('/delete/blacklist', helperController.deleteAllBlackList);
helperRouter.post('/userskill', helperController.addUserSkill)
helperRouter.post('/userplans', helperController.addSkillMyPlans)

module.exports = helperRouter;
