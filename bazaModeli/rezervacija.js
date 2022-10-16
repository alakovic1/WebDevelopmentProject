const Sequelize = require("sequelize");

module.exports = function(sequelize,DataTypes){
    const Rezervacija = sequelize.define("Rezervacija",{
        //id:{ type: Sequelize.INTEGER, primaryKey: true }
        //ostale kolone kreirane u db.js prilikom vezivanja tabela
    })
    return Rezervacija;
};