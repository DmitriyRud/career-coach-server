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
     static associate({ User, WebSite, Report, Recomendation }) {
      this.belongsTo(User, { foreignKey: 'user_id' })
      this.belongsTo(WebSite, { foreignKey: 'website_id' })
      this.hasMany(Report, { foreignKey: 'result_id' })
      this.hasMany(Recomendation, { foreignKey: 'result_id' })
    }
  }
  Result.init({
    search_string: DataTypes.STRING,
    count_vacancy: DataTypes.INTEGER,
    period: DataTypes.INTEGER,
    city: DataTypes.STRING,
    salary: DataTypes.STRING,
    website_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Result',
  });
  return Result;
};
