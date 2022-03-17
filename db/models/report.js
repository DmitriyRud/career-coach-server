'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Result, Skills }) {
      this.belongsTo(Result, { foreignKey: 'result_id' })
      this.belongsTo(Skills, { foreignKey: 'skill_id' })
    }
  }
  Report.init({
    skill_id: DataTypes.INTEGER,
    count: DataTypes.INTEGER,
    result_id: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'Report',
  });
  return Report;
};
