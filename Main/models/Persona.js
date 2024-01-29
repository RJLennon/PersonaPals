const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Persona extends Model {}

//Create table and define columns for persona data

Persona.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    short_description: {
      type: DataTypes.STRING,
    },
    long_description: {
      type: DataTypes.STRING(1234),
    },
    filename: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'persona',
  }
);

module.exports = Persona;
