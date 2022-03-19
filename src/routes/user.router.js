const userRouter = require('express').Router()
const userController = require('../controllers/user.controller')


//ДЛя learn 
userRouter.post('/adduserskilllearn', userController.newUserSkillLearn )
userRouter.get('/allUserSkillsFromLearn/:id', userController.allUserSkillsFromLearn )
//For Skill
userRouter.post('/adduserskillskill', userController.newUserSkillSkill )
userRouter.get('/allUserSkillsFromSkills/:id', userController.allUserSkillsFromSkills )



//deleteSkill
// userRouter.post('/adduserskill', userController.---- )
//deleteLearn
// userRouter.post('/adduserskill', userController.---- )

//editSkill если время будет
// userRouter.post('/adduserskill', userController.newUserSkill )

module.exports = userRouter
