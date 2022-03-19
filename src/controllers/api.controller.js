const { User } = require('../../db/models');
const axios = require('axios');


const apiHH = async (req, res) => {
  const { title, amount, days, city, salary } = req.body;
  console.log({ title, amount, days, city, salary });
  
  const response = await axios('https://api.hh.ru/vacancies/?text=Javascript&search_field=name&period=7&per_page=3&page=1&enable_snippets=false', {
    method: 'get',
    headers: {
      // 'User-Agent': 'api-test-agent',
      'User-Agent': 'CareerCoach (cska2004@gmail.com)',
      'Authorization': 'Bearer RM1KOOF087Q6RQU6955O05TSTGKD0BVS42VNHP1MBGIH705VS1NQBSBJ5C2761CN',
    },
  }
  );

  // const response = await axios('https://hh.ru/oauth/token', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded ',
  //   },
  //   data: 'grant_type=client_credentials&client_id=V1DRFKEBUA2GKI06N4CGLILS3FJ2P2U2ES2QHNE5JR87HLOQESP2LR1L23V0BB9G&client_secret=T1QO58QPRRVDRB6JV7U5MBQUFOV14K773MPU8JKU95UFADJT07D1L6UIE7V4TBN7',

  // });
  //console.log(response.data.items);
  const vacancies = response.data.items;
  //console.log(vacancies);
  for (let i = 0; i < vacancies.length; i++) {
    console.log('id = ', vacancies[i].id);
    const oneVacancy = await axios(`https://api.hh.ru/vacancies/${vacancies[i].id}`, {
    method: 'get',
    headers: {
      // 'User-Agent': 'api-test-agent',
      'User-Agent': 'CareerCoach (cska2004@gmail.com)',
      'Authorization': 'Bearer RM1KOOF087Q6RQU6955O05TSTGKD0BVS42VNHP1MBGIH705VS1NQBSBJ5C2761CN',
    },
  });
    console.log(oneVacancy.data.name);
    console.log(oneVacancy.data.description);
    console.log(oneVacancy.data.key_skills);
  }

  return res.json(response.data);
};



module.exports = {
  apiHH,
};
