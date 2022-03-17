'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ WhiteList, BlackList, UserSkill, UserPlans, BestVacancy, Result, Recomendation }) {
      this.hasMany(WhiteList, { foreignKey: 'user_id' })
      this.hasMany(BlackList, { foreignKey: 'user_id' })
      this.hasMany(UserSkill, { foreignKey: 'user_id' })
      this.hasMany(UserPlans, { foreignKey: 'user_id' })
      this.hasMany(BestVacancy, { foreignKey: 'user_id' })
      this.hasMany(Result, { foreignKey: 'user_id' })
      this.hasMany(Recomendation, { foreignKey: 'user_id' })
    }
  }
  User.init({
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    fio: DataTypes.STRING,
    avatar: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
