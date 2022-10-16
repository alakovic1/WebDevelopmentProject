const Sequelize = require("sequelize");

module.exports = function(sequelize,DataTypes){
    const Sala = sequelize.define("Sala",{
        //id:{ type: Sequelize.INTEGER, primaryKey: true },
        naziv: Sequelize.STRING,
        //zaduzenaOsoba se kreira u db.js
    })
    return Sala;
};
