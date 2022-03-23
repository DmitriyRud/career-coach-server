const userRouter = require('express').Router()
const { user } = require('pg/lib/defaults')
const userController = require('../controllers/user.controller')

//Вывод скилов из Skills  в компонент SelectSkills
userRouter.get('/allskillsforskillsselect', userController.allSkillsForSelectSkills )

//Update rate for skills
userRouter.put('/changerate',userController.newRate)

//----------------------------------------------------
userRouter.get('/checkuserid', userController.checkUserId )



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
