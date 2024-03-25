const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const ResetCode = sequelize.define('resetCode', {
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    //userId
});

module.exports = ResetCode;