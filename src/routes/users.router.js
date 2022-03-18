const { Router } = require('express');
const userController = require('../controllers/user.controller');
const upload = require('../middlewares/multer');

const authRouter = Router();

authRouter.put('/profile', upload.single('file'), userController.updateUser);

module.exports = authRouter;
