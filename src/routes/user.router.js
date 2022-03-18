const userRouter = require('express').Router()
const userController = require('../controllers/user.controller')


userRouter.post('/adduserskill', userController.newUserSkill )
//Здесь будет allSkill
// userRouter.post('/adduserskill', userController.newUserSkill )

//deleteSkill
// userRouter.post('/adduserskill', userController.newUserSkill )

//editSkill если время будет
// userRouter.post('/adduserskill', userController.newUserSkill )

module.exports = userRouter
