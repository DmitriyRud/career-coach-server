const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const checkAuth = require('../middlewares/checkAuth');

const authRouter = Router();

authRouter.post('/signup', authController.signUp);
authRouter.post('/signin', authController.signIn);
authRouter.get('/signout', authController.signOut);
authRouter.get('/check', checkAuth, authController.checkAuth);
authRouter.get('/checkiflogged', checkAuth, authController.checkIfLoggedIn);

module.exports = authRouter;
