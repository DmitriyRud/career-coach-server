'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recomendation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate({ User, Result }) {
      this.belongsTo(User, { foreignKey: 'user_id' })
      this.belongsTo(Result, { foreignKey: 'result_id' })
    }
  }
  Recomendation.init({
    user_id: DataTypes.INTEGER,
    result_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Recomendation',
  });
  return Recomendation;
};
