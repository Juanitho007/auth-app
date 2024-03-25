const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const Report = sequelize.define("report", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  evidence: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  //userId
});

module.exports = Report;
