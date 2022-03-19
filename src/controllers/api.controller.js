const { User } = require('../../db/models');
const axios = require('axios');
require('dotenv').config();


const apiHH = async (req, res) => {
  let { title, amount, days, city, salary } = req.body;
  console.log({ title, amount, days, city, salary });
  const period = (days > 30)? 30 : +days;

  if (amount > 1999) amount = 1999; // Убрать эту строку, когда сделаем логику поиска более 2000 вакансий (ограничение API hh.ru)

  let pages = 1;
  if (amount > 100) {
    pages = -~(amount/100);
  }
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

  const response = await axios('https://api.hh.ru/areas/113', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded ',
    },
    data: 'grant_type=client_credentials&client_id=${process.env.API_CLIENT_ID}&client_secret=${process.env.API_CLIENT_SECRET}',

  });
  //console.log(response.data);
  const areasArr = response.data.areas;
  let areaCode = -1;

  for (let i = 0; i < areasArr.length; i++){
    if (city.toUpperCase() === areasArr[i].name.toUpperCase()) {
      areaCode = areasArr[i].id;
      break;
    } else if (areasArr[i].areas.length > 0) {
      for (let j = 0; j < areasArr[i].areas.length; j++){
        if (city.toUpperCase() === areasArr[i].areas[j].name.toUpperCase()) {
      areaCode = areasArr[i].areas[j].id;
      break;
    }
      }
    }
  }

  //console.log('areaCode = ', areaCode);

  //return res.json(response.data);


  //Получение списка вакансий по заданным параметрам

  let perPage = (amount <= 100)? amount : 100;

  for (let page = 0; page < pages; page++) {
    const response = await axios(`https://api.hh.ru/vacancies/?text=${title}&search_field=name&period=${period}&per_page=${perPage}&page=${page}&area=${areaCode}&order_by=publication_time`, {
      method: 'get',
      headers: {
        // 'User-Agent': 'api-test-agent',
        'User-Agent': 'CareerCoach (cska2004@gmail.com)',
        'Authorization': `Bearer ${process.env.API_KEY}`,
      },
    }
    );

    amount -= 100;
    if (amount <= 100) perPage = amount;

    const vacancies = response.data.items;

    // Проход по всем найденным вакансиям для сбора информации

    for (let i = 0; i < vacancies.length; i++) {
      console.log('id = ', vacancies[i].id);
      const oneVacancy = await axios(`https://api.hh.ru/vacancies/${vacancies[i].id}`, {
        method: 'get',
        headers: {
          // 'User-Agent': 'api-test-agent',
          'User-Agent': 'CareerCoach (cska2004@gmail.com)',
          'Authorization': `Bearer ${process.env.API_KEY}`,
        },
      });
      console.log(oneVacancy.data.name);
      console.log(oneVacancy.data.description);
      console.log(oneVacancy.data.key_skills);
    }
  }
  return res.json(response.data);
};



module.exports = {
  apiHH,
};
