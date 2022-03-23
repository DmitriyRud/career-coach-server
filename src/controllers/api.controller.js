const { Result, Report, Skills, UserSkill } = require('../../db/models');
const axios = require('axios');
const { allUserSkillsFromSkills } = require('./user.controller');
require('dotenv').config();


const apiHH = async (req, res) => {
  let { userId, title, amount = 1, period = 1, city = 'Россия', salary, websites } = req.body;
  const skillsObj = {};


  console.log({ userId, title, amount, period, city, salary });
  period = (period > 30) ? 30 : +period;

  let bestVacansiesArr = [];

  const userSkills = await UserSkill.findAll({
      where: { user_id: +userId },
      include: Skills,
      order: [["createdAt", "DESC"]],
    });
  console.log('userSkills = ', userSkills[0].Skill.skill);
  

  //const userSkills = allUserSkillsFromSkills(userId);

  //console.log({amount, pages});

  // Получение токена - нужно только один раз или если токен был заблокирован

  // const response = await axios('https://hh.ru/oauth/token', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded ',
  //   },
  //   data: 'grant_type=client_credentials&client_id=${process.env.API_CLIENT_ID}&client_secret=${process.env.API_CLIENT_SECRET}',

  // });
  //console.log(response.data.items);


  // Получение кода региона для дальнейшего использования в поиске
  // код 113 - это Россия. Если будут нужны другие страны, то нужно будет получать еще код региона перед этим

  let areaCode = 113;
  if (city !== 'Россия') {
    const response = await axios('https://api.hh.ru/areas/113', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded ',
      },
      data: 'grant_type=client_credentials&client_id=${process.env.API_CLIENT_ID}&client_secret=${process.env.API_CLIENT_SECRET}',

    });
    //console.log(response.data);
    const areasArr = response.data.areas;


    for (let i = 0; i < areasArr.length; i++) {
      if (city.toUpperCase() === areasArr[i].name.toUpperCase()) {
        areaCode = areasArr[i].id;
        city = areasArr[i].name;
        break;
      } else if (areasArr[i].areas.length > 0) {
        for (let j = 0; j < areasArr[i].areas.length; j++) {
          if (city.toUpperCase() === areasArr[i].areas[j].name.toUpperCase()) {
            areaCode = areasArr[i].areas[j].id;
            city = areasArr[i].name;
            break;
          }
        }
      }
    }
  }
  //console.log('areaCode = ', areaCode);

  //return res.json(response.data);
  
  // Корректировка количества вакансий
  
  const requestAmount = await axios(`https://api.hh.ru/vacancies/?text=${title}&search_field=name&period=${period}&area=${areaCode}`, {
    method: 'get',
    headers: {
      'User-Agent': 'CareerCoach (cska2004@gmail.com)',
      'Authorization': `Bearer ${process.env.API_KEY}`,
    },
  }
  );
  
  //console.log('найдено вакансий: ', requestAmount.data.found);
  const vacanciesFound = await requestAmount.data.found;

  if (amount > vacanciesFound) amount = vacanciesFound;
  //console.log({amount});
  let pages = 1;
  if (amount > 100) {
    pages = -~(amount / 100);
  }

  let perPage = (amount <= 100) ? amount : 100;
  let amount2 = amount;

  //Получение списка вакансий по заданным параметрам
  for (let page = 0; page < pages; page++) {
    const requestString = (salary) ? `https://api.hh.ru/vacancies/?text=${title}&search_field=name&salary=${salary}&period=${period}&per_page=${perPage}&page=${page}&area=${areaCode}&order_by=publication_time` :
      `https://api.hh.ru/vacancies/?text=${title}&search_field=name&period=${period}&per_page=${perPage}&page=${page}&area=${areaCode}&order_by=publication_time`;
    
    //console.log({requestString});
      const response = await axios(requestString, {
      method: 'get',
      headers: {
        // 'User-Agent': 'api-test-agent',
        'User-Agent': 'CareerCoach (cska2004@gmail.com)',
        'Authorization': `Bearer ${process.env.API_KEY}`,
      },
    }
    );

    amount2 -= 100;
    if (amount2 <= 100) perPage = amount2;


    const vacancies = response.data.items;
    //console.log('vacancies =====>', vacancies);

    // Проход по всем найденным вакансиям для сбора информации

    for (let i = 0; i < vacancies.length; i++) {
      //console.log('id = ', vacancies[i].id);
      const oneVacancy = await axios(`https://api.hh.ru/vacancies/${vacancies[i].id}`, {
        method: 'get',
        headers: {
          'User-Agent': 'CareerCoach (cska2004@gmail.com)',
          'Authorization': `Bearer ${process.env.API_KEY}`,
        },
      });
      //console.log(oneVacancy.data.name);          // Наименование найденной вакансии
      //console.log(oneVacancy.data.description);   // Полное описание вакансии
      //console.log(oneVacancy.data.key_skills);    // Массив с ключевыми навыками

      const keySkillsArr = oneVacancy.data.key_skills;
      for (let x = 0; x < keySkillsArr.length; x++) {
        if (skillsObj[keySkillsArr[x].name.toUpperCase()] > 0) {
          skillsObj[keySkillsArr[x].name.toUpperCase()] += 1;
        } else {
          skillsObj[keySkillsArr[x].name.toUpperCase()] = 1;
        }
      }
    }
  }

  // Если скилы нашлись, то запишем их в таблицу Result
  if (Object.keys(skillsObj).length !== 0) {
    const newResult = await Result.create({
      search_string: title,
      count_vacancy: amount,
      period: period,
      city: city,
      salary: salary,
      website_id: 1,
      user_id: req.session.user.id
    });
    //console.log('added new result to DB ===> ',newResult);

    // Если все Ок, записываем в Report
    if (newResult) {
      const skillsArr = [];
      for (let key in skillsObj) {
        //console.log({key});
        const checkOrCreateSkill = await Skills.findOrCreate({
          where: { skill: key },
          defaults: {
            skill: key,
          },
        });
        //console.log('checkOrCreateSkill = ',checkOrCreateSkill);
        skillsArr.push({
          skill_id: checkOrCreateSkill[0].id,
          count: skillsObj[key],
          result_id: newResult.id
        });
      }
     // console.log(skillsArr);
      const newReport = await Report.bulkCreate(skillsArr);
      //console.log('added new report to DB ===> ',newReport);
      return res.json({ resultId: newResult.id });
    }
  }
  return res.json({});
};



module.exports = {
  apiHH,
};
