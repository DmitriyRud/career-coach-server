const { Result, Report, Skills, UserSkill, BestVacancy } = require('../../db/models');
const axios = require('axios');
const { allUserSkillsFromSkills } = require('./user.controller');

require('dotenv').config();


function contains(arr, elem) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].toUpperCase() === elem) {
      return true;
    }
  }
  return false;
}


const apiHH = async (req, res) => {
  let { userId, title, amount = 1, period = 1, city = 'Россия', salary, websites } = req.body;
  const skillsObj = {};


  period = (period > 30) ? 30 : +period;



  const userSkills = await UserSkill.findAll({
    where: { user_id: +userId },
    include: Skills,
    order: [["createdAt", "DESC"]],
  });

  const userSkillsArr = [];
  if (userSkills.length > 0) {
    for (let i = 0; i < userSkills.length; i++) {
      userSkillsArr.push(userSkills[i].Skill.skill);
    }
  }


  //const userSkills = allUserSkillsFromSkills(userId);


  // Получение токена - нужно только один раз или если токен был заблокирован

  // const response = await axios('https://hh.ru/oauth/token', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded ',
  //   },
  //   data: 'grant_type=client_credentials&client_id=${process.env.API_CLIENT_ID}&client_secret=${process.env.API_CLIENT_SECRET}',

  // });


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

  const vacanciesFound = await requestAmount.data.found;

  if (amount > vacanciesFound) amount = vacanciesFound;
  let pages = 1;
  if (amount > 100) {
    pages = -~(amount / 100);
  }

  let perPage = (amount <= 100) ? amount : 100;
  let amount2 = amount;

  let bestVacansiesArr = [];
  //Получение списка вакансий по заданным параметрам
  for (let page = 0; page < pages; page++) {
    const requestString = (salary) ? `https://api.hh.ru/vacancies/?text=${title}&search_field=name&salary=${salary}&period=${period}&per_page=${perPage}&page=${page}&area=${areaCode}&order_by=publication_time` :
      `https://api.hh.ru/vacancies/?text=${title}&search_field=name&period=${period}&per_page=${perPage}&page=${page}&area=${areaCode}&order_by=publication_time`;

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

    // Проход по всем найденным вакансиям для сбора информации

    for (let i = 0; i < vacancies.length; i++) {
      let bestVacsObj = {};
      const oneVacancy = await axios(`https://api.hh.ru/vacancies/${vacancies[i].id}`, {
        method: 'get',
        headers: {
          'User-Agent': 'CareerCoach (cska2004@gmail.com)',
          'Authorization': `Bearer ${process.env.API_KEY}`,
        },
      });

      const keySkillsArr = oneVacancy.data.key_skills;
      let matchesWithUser = 0;
      for (let x = 0; x < keySkillsArr.length; x++) {
        if (contains(userSkillsArr, keySkillsArr[x].name.toUpperCase())) {
          ++matchesWithUser;
        }

        if (skillsObj[keySkillsArr[x].name.toUpperCase()] > 0) {
          skillsObj[keySkillsArr[x].name.toUpperCase()] += 1;
        } else {
          skillsObj[keySkillsArr[x].name.toUpperCase()] = 1;
        }
      }

      bestVacsObj[vacancies[i].alternate_url.split('?')[0]] = matchesWithUser;
      bestVacsObj['job_title'] = vacancies[i].name;
      bestVacsObj.company = vacancies[i].employer.name;
      let salaryStr = ''
      if (!vacancies[i].salary) {
        salaryStr = 'З/п не указана';
      } else {
        if (vacancies[i].salary?.from) {
          salaryStr = (vacancies[i].salary?.to !== undefined && vacancies[i].salary?.to !== null) ? 'от ' + vacancies[i].salary?.from + ' до ' + vacancies[i].salary?.to + ' ' : vacancies[i].salary?.from + ' ';
        } else if (vacancies[i].salary?.to) {
          salaryStr = 'до ' + vacancies[i].salary?.to;
        }
        if (vacancies[i].salary?.currency) {
          salaryStr = salaryStr + vacancies[i].salary?.currency + ' ';
        }
        if (vacancies[i].salary) {
          if (vacancies[i].salary?.currency?.gross) {
            salaryStr = salaryStr + 'до уплаты налогов';
          } else {
            salaryStr = salaryStr + 'на руки';
          }
        }
      }

      bestVacsObj.salary = salaryStr;

      bestVacansiesArr.push(bestVacsObj);
    }
    bestVacansiesArr.sort((a, b) => Object.values(b)[0] - Object.values(a)[0]);
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

    // Обрезаем массив с подходящими вакансиями до 10 элементов
    bestVacansiesArr = bestVacansiesArr.slice(0, 10);

    // Удаляем все записи о подходящих вакансиях из таблицы BestVacancy для этого юзера
    const erase = await BestVacancy.destroy({ where: { user_id: req.session.user.id } });

    // И записываем подходящие вакансии в таблицу BestVacancy
    for (let i = 0; i < bestVacansiesArr.length; i++) {
      const writeVacansies = BestVacancy.create({
        user_id: req.session.user.id,
        url: Object.keys(bestVacansiesArr[i])[0],
        job_title: bestVacansiesArr[i].job_title,
        company: bestVacansiesArr[i].company,
        salary: bestVacansiesArr[i].salary,
      });
    }


    // Если все Ок, записываем в Report
    if (newResult) {
      const skillsArr = [];
      for (let key in skillsObj) {
        const checkOrCreateSkill = await Skills.findOrCreate({
          where: { skill: key },
          defaults: {
            skill: key,
          },
        });
        skillsArr.push({
          skill_id: checkOrCreateSkill[0].id,
          count: skillsObj[key],
          result_id: newResult.id
        });
      }
      const newReport = await Report.bulkCreate(skillsArr);
      return res.json({ resultId: newResult.id });
    }
  }
  return res.json({});
};



module.exports = {
  apiHH,
};
