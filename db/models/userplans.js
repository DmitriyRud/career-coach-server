'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserPlans extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserPlans.init({
    user_id: DataTypes.INTEGER,
    skill_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserPlans',
  });
  return UserPlans;
};