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
     static associate({ User, Skills }) {
      this.belongsTo(User, { foreignKey: 'user_id' })
      this.belongsTo(Skills, { foreignKey: 'skill_id' })
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
