const { User, Skills, UserSkill } = require("../../db/models");

//Добавление скилов в таблицы "User, Skills, UserSkill" если они не добавленны 
const newUserSkill = async (req, res) => {
  const { input, id } = req.body.skill;
  if (!input) {
    return res.sendStatus(418);
  }

  const checkOrCreateSkill = await Skills.findOrCreate({
    where: { skill: input },
    defaults: {
      skill: input,
    },
  });

  const skillId = checkOrCreateSkill[0].dataValues.id;
  const userSkill = await UserSkill.findOrCreate({
    where: { user_id: id, skill_id: +skillId },
    defaults: {
      user_id: +id,
      skill_id: +skillId,
    },
  });

  return res.json(checkOrCreateSkill[0].dataValues.skill);
};

const updateUser = async (req, res) => {
  const { id, name, password, email, fio } = req.body;

  //проверка какие данные есть (такие только и меняем)
  const updateData = {};
  if (name) updateData.name = name;
  if (password) updateData.password = password;
  if (email) updateData.email = email;
  if (fio) updateData.fio = fio;
  if (req.file?.originalname)
    updateData.avatar = `/images/${req.file.originalname}`;
  // TODO защита по сессии, включить когда будет готов код на фронте, отключена для тестирования из Постмана
  // if (id === req.session.user.id) {
  if (id) {
    try {
      await User.update(updateData, { where: { id } });
      const newUser = await User.findOne({ where: { id }, raw: true });
      req.session.user = {
        id: newUser.id,
        name: newUser.name,
      };
      return res.json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        fio: newUser.fio,
        avatar: newUser.avatar,
      });
    } catch (error) {
      return res.sendStatus(500);
    }
  }

  return res.sendStatus(400);
};

module.exports = {
  updateUser,
  newUserSkill,
};
