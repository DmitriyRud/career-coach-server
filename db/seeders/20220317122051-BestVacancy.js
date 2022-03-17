'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('BestVacancies', [{
      user_id: 1,
      url: 'https://hh.ru/vacancy/52403414?from=vacancy_search_list&hhtmFrom=vacancy_search_list&query=Javascript%20junior',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('BestVacancies', null, {});
  }
};
