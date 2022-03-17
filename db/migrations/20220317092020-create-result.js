'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Results', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      search_string: {
        allowNull: false,
        type: Sequelize.STRING
      },
      count_vacancy: {
        type: Sequelize.INTEGER
      },
      period: {
        type: Sequelize.INTEGER
      },
      city: {
        type: Sequelize.STRING
      },
      salary: {
        type: Sequelize.STRING
      },
      web_site_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      report_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Results');
  }
};
