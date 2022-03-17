'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSkill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserSkill.init({
    user_id: DataTypes.INTEGER,
    skill_id: DataTypes.INTEGER,
    rate: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserSkill',
  });
  return UserSkill;
};