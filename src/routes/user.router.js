const userRouter = require('express').Router()
const userController = require('../controllers/user.controller')


//ДЛя learn 
userRouter.post('/adduserskilllearn', userController.newUserSkillLearn )
userRouter.get('/allUserSkillsFromLearn/:id', userController.allUserSkillsFromLearn )
//For Skill
userRouter.post('/adduserskillskill', userController.newUserSkillSkill )
userRouter.get('/allUserSkillsFromSkills/:id', userController.allUserSkillsFromSkills )



//deleteSkill
userRouter.delete('/deleteuserskill', userController.deleteUserSkillFromSkill )
//deleteLearn
userRouter.delete('/deleteuserlearn', userController.deleteUserSkillFromLearn)

//editSkill если время будет
// userRouter.post('/adduserskill', userController.newUserSkill )

module.exports = userRouter
