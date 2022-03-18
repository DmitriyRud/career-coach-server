// const { Result, Report } = require('../../db/models');

const getOneResult = async (req, res) => {
  const { id } = req.params;
  console.log('getOneResult >>>>> ', id);
  res.json({
    search_string: 'Junior JavaScript',
    web_site: 'HaedHunter',
    count_vacancy: 400,
    period: 86400, // в секундах, Дима знает как положить их правильно
    city: 'Москва',
    salary: '150k',
    createdAt: '2022-03-17 19:09:36.420 +0300',
  })
}

const getOneReport = async (req, res) => {
  const { id } = req.params;
  console.log('getOneReport >>>>> ', id);
  res.json([['React', 132], ['JavaScript', 456], ['Redux', 97], ['GIT', 247]])
}


module.exports = {
  getOneResult,
  getOneReport,
}
