const { User } = require('../../db/models');

const signUp = async (req, res) => {
  const { name, password, email } = req.body;

  if (name && password && email) {
    try {
      const newUser = await User.create({
        name,
        password,
        email,
      });
      req.session.user = {
        id: newUser.id,
        name: newUser.name,
      };
      return res.json({ id: newUser.id, name: newUser.name, email: newUser.email, fio: newUser.fio, avatar: newUser.avatar });
    } catch (error) {
      return res.sendStatus(500);
    }
  }

  return res.sendStatus(400);
};

const signIn = async (req, res) => {
  const { password, name } = req.body;

  if (password && name) {
    try {
      const currentUser = await User.findOne({ where: { name } });
      if (currentUser && currentUser.password === password) {
        req.session.user = {
          id: currentUser.id,
          name: currentUser.name,
        };

        return res.json({ id: currentUser.id, name: currentUser.name, email: currentUser.email, fio: currentUser.fio, avatar: currentUser.avatar });
      }
      return res.sendStatus(401);
    } catch (error) {
      return res.sendStatus(500);
    }
  }

  return res.sendStatus(400);
};

const signOut = async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.sendStatus(500);

    res.clearCookie(req.app.get('cookieName'));

    return res.sendStatus(200);
  });
};

const checkAuth = async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user.id);
    return res.json({ id: user.id, userName: user.userName });
  } catch (error) {
    return res.sendStatus(500);
  }
};

const checkIfLoggedIn = async (req, res) => {
  if (req.session.user.id) {
    const currentUser = await User.findByPk(req.session.user.id);
    return res.json({ id: currentUser.id, name: currentUser.name, email: currentUser.email, fio: currentUser.fio, avatar: currentUser.avatar });
  } else {
    return res.json({});
  }
}

module.exports = {
  signIn,
  signOut,
  signUp,
  checkAuth,
  checkIfLoggedIn,
};
