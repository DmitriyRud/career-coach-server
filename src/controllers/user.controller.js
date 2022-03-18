const { User } = require('../../db/models');

const updateUser = async (req, res) => {

  const { id, name, password, email, fio } = req.body;
    
  //проверка какие данные есть (такие только и меняем)
  const updateData = {};
  if (name) updateData.name = name
  if (password) updateData.password = password
  if (email) updateData.email = email
  if (fio) updateData.fio = fio
  if (req.file?.originalname) updateData.avatar = `/images/${req.file.originalname}`
  // TODO защита по сессии, включить когда будет готов код на фронте, отключена для тестирования из Постмана
  // if (id === req.session.user.id) {
  if (id) {
    try {
      
      await User.update(updateData, { where: { id } });
      const newUser = await User.findOne({ where: { id }, raw: true})
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



module.exports = {
  updateUser,
};
