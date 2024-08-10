'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    static associate (models) {
      Blog.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  Blog.init({
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    url: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    comments: {
      type: DataTypes.TEXT, // Cambiar a TEXT para almacenar como JSON
      get () {
        const rawValue = this.getDataValue('comments');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set (value) {
        this.setDataValue('comments', JSON.stringify(value));
      },
    },
  }, {
    sequelize,
    modelName: 'Blog',
  });

  return Blog;
};
