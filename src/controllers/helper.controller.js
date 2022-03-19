const { Result, Report, Skills, WebSite } = require('../../db/models');

const getOneResult = async (req, res) => {
  const { id } = req.params;
  const response = await Result.findOne({ where: { id }, raw: true, include: WebSite });
  const answer = {
      search_string: response.search_string,
      web_site: response['WebSite.name'],
      count_vacancy: response.count_vacancy,
      period: response.period, // в секундах, Дима знает как положить их правильно
      city: response.city,
      salary: response.salary,
      createdAt: response.createdAt,
    };
  res.json(answer)
}

const getOneReport = async (req, res) => {
  const { id } = req.params;
  const response = await Report.findAll({where: { result_id: id }, raw: true, include: Skills});
  const answer = response.map((el) => {
    return [el['Skill.skill'], el.count]
  });
  res.json(answer)
}


module.exports = {
  getOneResult,
  getOneReport,
}
