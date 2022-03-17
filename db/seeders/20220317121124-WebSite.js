'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('WebSites', [{
      name: 'HeadHunter',
      url: 'https://hh.ru/',
      type: 'scrapping',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('WebSites', null, {});
  }
};
