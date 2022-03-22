const { Result, Report, Skills, WebSite, WhiteList, BlackList, UserSkill, UserPlans, BestVacancy } = require('../../db/models');

const getOneResult = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Result.findOne({ where: { id }, raw: true, include: WebSite });
    const answer = {
        search_string: response.search_string,
        web_site: response['WebSite.name'],
        count_vacancy: response.count_vacancy,
        period: response.period,
        city: response.city,
        salary: response.salary,
        createdAt: response.createdAt,
      };
      // console.log(answer);
    return res.json(answer)
  } catch (error) {
    return res.sendStatus(500)
  }
}

const getUserAllResult = async (req, res) => {
  const { id } = req.params;
  // id = user_id
  try {
    const response = await Result.findAll({ where: { user_id: id }, raw: true, include: WebSite  });
    // console.log('getUserAllResult >>>> >>>>  ', response);
    const answer = response.map((el) => {
      return (
        {
          id: el.id,
          search_string: el.search_string,
          web_site: el['WebSite.name'],
          count_vacancy: el.count_vacancy,
          period: el.period,
          city: el.city,
          salary: el.salary,
          createdAt: el.createdAt,
        }
      )
    });
      //console.log('answer ======>', answer);
    return res.json(answer)
  } catch (error) {
    return res.sendStatus(500)
  }
}

const getOneReport = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Report.findAll({where: { result_id: id }, raw: true, include: Skills});
    const answer = response.map((el) => {
      return [el['Skill.skill'], el.count]
    });
    return res.json(answer)
    
  } catch (error) {
    return res.sendStatus(500)
  }
}

const addSkillWhiteList = async (req, res) => {
  const { skill } = req.body;
  try {
    if(req?.session?.user?.id) {
      const response = await WhiteList.findAll({where: {user_id: req.session.user.id}, raw: true});
      if(response.length === 0) {
        await WhiteList.create({ word: skill, user_id: req.session.user.id});
        return res.sendStatus(200)
      }
      const checkSkill = response.findIndex((el) => el.word === skill);
      if (checkSkill === -1) {
        await WhiteList.create({ word: skill, user_id: req.session.user.id});
        return res.sendStatus(200) 
      }
      return res.sendStatus(200)
    }
    res.sendStatus(400)
  } catch (error) {
    return res.sendStatus(500)
  }
}

const addSkillBlackList = async (req, res) => {
  const { skill } = req.body;  
  try {
    if(req?.session?.user?.id) {
      const response = await BlackList.findAll({where: {user_id: req.session.user.id}, raw: true});
      if(response.length === 0) {
        await BlackList.create({ word: skill, user_id: req.session.user.id});
        return res.sendStatus(200)
      }
      const checkSkill = response.findIndex((el) => el.word === skill);
      if (checkSkill === -1) {
        await BlackList.create({ word: skill, user_id: req.session.user.id});
        return res.sendStatus(200) 
      }
      return res.sendStatus(200)
    }
    res.sendStatus(400)
  } catch (error) {
    return res.sendStatus(500)
  }
}

const getAllFromWhiteList = async (req, res) => {
  try {
    const { id } = req.params;
    const allItemsFromWhiteList = await WhiteList.findAll({
      where: { user_id: +id },
      // include: Skills,
      // order: [["createdAt", "DESC"]],
    });
    return res.json(allItemsFromWhiteList);
  } catch (error) {
    res.sendStatus(418);
  }
}  

const getAllFromBlackList = async (req, res) => {
  try {
    const { id } = req.params;
    const allItemsFromBlackList = await BlackList.findAll({
      where: { user_id: +id },
      // include: Skills,
      // order: [["createdAt", "DESC"]],
    });
    return res.json(allItemsFromBlackList);
  } catch (error) {
    res.sendStatus(418);
  }
}  

const deleteFromWhiteList = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(req.body)
    const { id } = req.params;
    console.log(id)
    await WhiteList.destroy({
      where: { id: +id, user_id: +userId },
    });
    res.sendStatus(202);
  } catch (error) {
    res.sendStatus(500);
  }
};

const deleteFromBlackList = async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;
    await BlackList.destroy({
      where: { id: +id, user_id: +userId },
    });
    res.sendStatus(202);
  } catch (error) {
    res.sendStatus(500);
  }
};

const deleteAllBlackList = async (req, res) => {
  try {
    const { userId } = req.body;
    await BlackList.destroy({ where: {user_id: +userId} })
    res.sendStatus(202);
  } catch (error) {
    res.sendStatus(500);
  }
};

const deleteAllWhiteList = async (req, res) => {
  try {
    const { userId } = req.body;
    await WhiteList.destroy({ where: {user_id: +userId} })
    res.sendStatus(202);
  } catch (error) {
    res.sendStatus(500);
  }
};

const addUserSkill = async (req, res) => {
  const { skill } = req.body;
  try {
    if(req?.session?.user?.id){
      const skillId = await Skills.findOrCreate({ where: { skill }, raw: true })
      await UserSkill.findOrCreate({ where: { user_id: req.session.user.id, skill_id: skillId[0].id}, raw: true })
      return res.sendStatus(200)
    }
    return res.sendStatus(400)
  } catch (error) {
    return res.sendStatus(500)
  }
}
const addSkillMyPlans = async (req, res) => {
  const { skill } = req.body;
  try {
    if(req?.session?.user?.id){
      const skillId = await Skills.findOrCreate({ where: { skill }, raw: true })
      await UserPlans.findOrCreate({ where: { user_id: req.session.user.id, skill_id: skillId[0].id}, raw: true })
      return res.sendStatus(200)
    }
    return res.sendStatus(400)
  } catch (error) {
    return res.sendStatus(500)
  }
}

const getRecomendation = async (req, res) => {
  const { id } = req.params;
  // id это result_id
  // console.log(id);
  // TODO сделать логику по рекомендациям, использовать текущие скилы пользователя

  // заглушка, пока нет логики для сбора массива
  res.json(['React', 'NodeJS', 'TypeScript'])
}

const getVacanciesUser = async (req, res) => {
  const { id } = req.params;
  console.log('getVacanciesUser id_user >>> ', id);
  const response = await BestVacancy.findAll({where: {user_id: id}, raw: true})
  // console.log(response);
  res.json(response)
}

module.exports = {
  getOneResult,
  getOneReport,
  addSkillWhiteList,
  getAllFromWhiteList,
  deleteFromWhiteList,
  addSkillBlackList,
  getAllFromBlackList,
  deleteFromBlackList,
  deleteAllBlackList,
  deleteAllWhiteList,
  addUserSkill,
  addSkillMyPlans,
  getRecomendation,
  getUserAllResult,
  getVacanciesUser
}
