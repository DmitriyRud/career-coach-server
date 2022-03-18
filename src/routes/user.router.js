const userRouter = require('express').Router()
const userController = require('../controllers/user.controller')


userRouter.post('/adduserskill', userController.newUserSkill )

module.exports = userRouter
