'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.hasMany(models.Blog, { foreignKey: 'userId' });
    }
  }

  User.init({
    username: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
