'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('UserSkills', [{
      user_id: 1,
      skill_id: 1,
      rate: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserSkills', null, {});
  }
};
