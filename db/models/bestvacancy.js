'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BestVacancy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate({ User }) {
      this.belongsTo(User, { foreignKey: 'user_id' })
    }
  }
  BestVacancy.init({
    user_id: DataTypes.INTEGER,
    url: DataTypes.STRING,
    job_title: DataTypes.STRING,
    company: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'BestVacancy',
  });
  return BestVacancy;
};
