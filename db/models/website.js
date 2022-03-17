'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WebSite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  WebSite.init({
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'WebSite',
  });
  return WebSite;
};