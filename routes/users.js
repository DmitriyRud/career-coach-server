const express = require('express');
const router = express.Router();
const { User } = require('../db/models')

/* GET users listing. */
// router.get('/', function(req, res) {
//   res.send('respond with a resource');
// });
router.post('/signin', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  
  if (!user) {
    return res.sendStatus(555);
  }
  
  if (user.password === req.body.password) {
    req.session.userName = user.name;
    req.session.userEmail = user.email;
    req.session.userId = user.id;
    return res.sendStatus(200);
  }
  return res.sendStatus(555);
});

router.post('/signup', async (req, res) => {
  const { username: name, email } = req.body;
  const password = req.body.password;
  // проверка уникальности имени и почты
  const checkName = await User.findOne({ where: { name } });
  const checkEmail = await User.findOne({ where: { email } });
  if (checkEmail || checkName) return res.sendStatus(555);
  const user = await User.create({ name, email, password });
  req.session.userName = user.name;
  req.session.userEmail = user.email;
  req.session.userId = user.id;
  res.sendStatus(200)
  // res.redirect('/users'); 
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('userCookie');
  res.redirect('/');
});
module.exports = router;
