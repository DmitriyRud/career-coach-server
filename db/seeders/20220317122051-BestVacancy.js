'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('BestVacancies', [{
      user_id: 1,
      url: 'https://hh.ru/vacancy/52403414?from=vacancy_search_list&hhtmFrom=vacancy_search_list&query=Javascript%20junior',
      job_title: 'Middle/Senior JavaScript Developer (Мальта, Сент-Джулианс)',
      company: 'Alex Staff Agency',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      user_id: 1,
      url: 'https://hh.ru/vacancy/53933508?from=vacancy_search_list&hhtmFrom=vacancy_search_list&query=Junior%20javascript',
      job_title: 'Frontend-разработчик (Junior/Middle)',
      company: 'Lofty',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      user_id: 1,
      url: 'https://hh.ru/vacancy/51990194?from=vacancy_search_list&hhtmFrom=vacancy_search_list&query=Junior%20javascript',
      job_title: 'Frontend разработчик',
      company: 'idaproject',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('BestVacancies', null, {});
  }
};
