//port je 3306, promijeniti ako nije Vas port 3306...
const Sequelize = require("sequelize");
const sequelize = new Sequelize("DBWT19","root","root",{host:"localhost",dialect:"mysql",logging:false, port:3306});
const db={};

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//import modela
db.Osoblje = sequelize.import(__dirname+'/bazaModeli/osoblje.js');
db.Rezervacija = sequelize.import(__dirname+'/bazaModeli/rezervacija.js');
db.Termin = sequelize.import(__dirname+'/bazaModeli/termin.js');
db.Sala = sequelize.import(__dirname+'/bazaModeli/sala.js');

//RELACIJE

//Osoblje ​- jedan na više - ​Rezervacija
db.Osoblje.hasMany(db.Rezervacija, {foreignKey: 'osoba'});
db.Rezervacija.belongsTo(db.Osoblje, {foreignKey: 'osoba'});

//Rezervacija ​- jedan na jedan -​ Termin
db.Termin.hasOne(db.Rezervacija, {foreignKey: {name: 'termin', type: Sequelize.INTEGER, unique: true}});
db.Rezervacija.belongsTo(db.Termin, {foreignKey: {name: 'termin', type: Sequelize.INTEGER, unique: true }});

//Rezervacija ​- više na jedan -​ Sala
db.Sala.hasMany(db.Rezervacija, {foreignKey: 'sala'});
db.Rezervacija.belongsTo(db.Sala, {foreignKey: 'sala'});

//Sala ​- jedan na jedan -​ Osoblje
db.Osoblje.hasOne(db.Sala, {foreignKey: 'zaduzenaOsoba'});
db.Sala.belongsTo(db.Osoblje, {foreignKey: 'zaduzenaOsoba'});

module.exports=db;