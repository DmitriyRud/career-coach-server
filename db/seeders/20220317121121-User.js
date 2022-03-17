'use strict';
const sha256 = require('sha256')

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Users', [{
      name: 'nana',
      password: sha256('123'),
      email: 'nana@email.ru',
      fio: 'Nana Nanovna',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
