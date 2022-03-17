'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Skills extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ UserSkill, UserPlans, Report }) {
      this.hasMany(UserPlans, { foreignKey: 'skill_id' })
      this.hasMany(UserSkill, { foreignKey: 'skill_id' })
      this.hasMany(Report, { foreignKey: 'skill_id' })
    }
  }
  Skills.init({
    skill: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Skills',
  });
  return Skills;
};
