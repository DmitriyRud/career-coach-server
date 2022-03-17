'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Result extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Result.init({
    search_string: DataTypes.STRING,
    count_vacancy: DataTypes.INTEGER,
    period: DataTypes.INTEGER,
    city: DataTypes.STRING,
    salary: DataTypes.STRING,
    web_site_id: DataTypes.INTEGER,
    report_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Result',
  });
  return Result;
};