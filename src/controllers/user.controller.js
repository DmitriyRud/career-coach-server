const {
  User,
  Skills,
  UserSkill,
  UserPlans,
  WhiteList,
  BlackList,
} = require("../../db/models");

//Check user id
const checkUserId = async (req, res) => {
  try {
    const { id } = req.session.user;
    res.json(id);
  } catch (error) {
    res.send({message: error})
  }
};

//Вывод скиллов из таблицы Skills в в компонент SelectSkills
const allSkillsForSelectSkills = async (req, res) => {
  // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  try {
    const allSkills = await Skills.findAll();
    // console.log("++++++++++++++", allSkills);
    res.json(allSkills);
  } catch (error) {
    res.sendStatus(418);
  }
};

//Вывод всех скиллов юзера из Skills
const allUserSkillsFromSkills = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log('---------S K I L L S----------',id);
    const allSkilsForSkills = await UserSkill.findAll({
      where: { user_id: +id },
      include: Skills,
      order: [["createdAt", "DESC"]],
    });

    return res.json(allSkilsForSkills);
  } catch (error) {
    res.sendStatus(418);
  }
};

//Вывод всех скиллов юзера из Learn
const allUserSkillsFromLearn = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log('=======L E A R N====', id);
    const allSkilsForLearn = await UserPlans.findAll({
      where: { user_id: +id },
      include: Skills,
      order: [["createdAt", "DESC"]],
    });
    return res.json(allSkilsForLearn);
  } catch (error) {
    res.sendStatus(418);
  }
};

//Добавление скилов в таблицы "User, Skills, UserPlans" если они не добавленны
const newUserSkillLearn = async (req, res) => {
  try {
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
    const userSkill = await UserPlans.findOrCreate({
      where: { user_id: id, skill_id: +skillId },
      defaults: {
        user_id: +id,
        skill_id: +skillId,
      },
    });

    return res.json({
      skill: checkOrCreateSkill[0].skill,
      skill_id: userSkill[0].skill_id,
      user_id: userSkill[0].user_id,
      category: "learn",
    });
  } catch (error) {
    res.sendStatus(418);
  }
};

//Добавление скилов в таблицы "User, Skills, UserSkill" если они не добавленны
const newUserSkillSkill = async (req, res) => {
  try {
    const { input, id } = req.body.skill;
    if (!input) {
      res.sendStatus(418);
    } else {
      const checkOrCreateSkill = await Skills.findOrCreate({
        where: { skill: input },
        defaults: {
          skill: input,
        },
      });

      const skillId = checkOrCreateSkill[0].dataValues.id;
      const userSkill = await UserSkill.findOrCreate({
        where: { user_id: id, skill_id: +skillId, rate: 0 },
        defaults: {
          user_id: +id,
          skill_id: +skillId,
        },
      });
      console.log(userSkill);
      // console.log(checkOrCreateSkill[0]);
      return res.json({
        skill: checkOrCreateSkill[0].skill,
        skill_id: userSkill[0].skill_id,
        user_id: userSkill[0].user_id,
        category: "skills",
      });
    }
  } catch (error) {
    res.send(error);
  }
};

//Удаление скилов юзера из skills
const deleteUserSkillFromSkill = async (req, res) => {
  try {
    const { user_id, skill_id } = req.body;
    const deleteSkill = await UserSkill.destroy({
      where: { user_id, skill_id },
    });
    if (deleteSkill) {
      res.status(202).json(skill_id);
    }
  } catch (error) {
    res.sendStatus(500);
  }
};

//Удаление скилов юзера из Learn(Plans)
const deleteUserSkillFromLearn = async (req, res) => {
  try {
    const { user_id, skill_id } = req.body;
    const deleteLearn = await UserPlans.destroy({
      where: { user_id, skill_id },
    });
    if (deleteLearn) {
      res.status(202).json(skill_id);
    }
  } catch (error) {
    res.sendStatus(500);
  }
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

const getUserData = async (req, res) => {
  try {
    const user_id = req?.session?.user?.id;

    const responseUserSkills = await UserSkill.findAll({
      where: { user_id },
      raw: true,
      include: Skills,
    });
    const responseUserPlans = await UserPlans.findAll({
      where: { user_id },
      raw: true,
      include: Skills,
    });
    const responseWhiteList = await WhiteList.findAll({
      where: { user_id },
      raw: true,
    });
    const responseBlackList = await BlackList.findAll({
      where: { user_id },
      raw: true,
    });

    const data = {
      whiteList: responseWhiteList,
      blackList: responseBlackList,
      userSkills: responseUserSkills,
      myPlans: responseUserPlans,
    };
    res.json(data);
  } catch (error) {
    res.sendStatus(500);
  }
};

module.exports = {
  updateUser,
  newUserSkillSkill,
  newUserSkillLearn,
  deleteUserSkillFromSkill,
  deleteUserSkillFromLearn,
  allUserSkillsFromSkills,
  allUserSkillsFromLearn,
  allSkillsForSelectSkills,
  getUserData,
  checkUserId,
};
