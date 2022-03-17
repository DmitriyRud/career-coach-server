'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Results', [{
      search_string: 'Junior JavaScript',
      count_vacancy: 400,
      period: 86400,
      website_id: 1,
      user_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Results', null, {});
  }
};
