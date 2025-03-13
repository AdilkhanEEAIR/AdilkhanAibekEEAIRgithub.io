const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');

const Clothing = sequelize.define('Clothing', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  size: { type: DataTypes.STRING, allowNull: false },
});

User.hasMany(Clothing);
Clothing.belongsTo(User);

module.exports = Clothing;