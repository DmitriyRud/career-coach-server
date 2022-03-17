'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      skill_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Skills' },
        onDelete: 'CASCADE'
      },
      count: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      result_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Results' },
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('Reports');
  }
};
