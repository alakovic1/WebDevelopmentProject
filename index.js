const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const db = require('./db.js')
db.sequelize.sync({force:true}).then(function(){
    inicijalizacija().then(function(){
        //console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
        process.exit();
    });
    //inicijalizacija();
});

var sveIzBaze = {};

app.get("/index.html", function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/pocetna.html");
});

app.get("/pocetna.html", function (req, res) {
	res.sendFile(__dirname + "/pocetna.html");
});

app.get("/osoblje.html", function (req, res) {
	res.sendFile(__dirname + "/osoblje.html");
});

app.get("/slike1", function (req, res) {
	res.write("{\"slika1\" : \"/slikeZaPocetnu/etf1.jpg\", \"slika2\" : \"/slikeZaPocetnu/etf2.png\", \"slika3\" : \"/slikeZaPocetnu/etf3.jpg\"}");
    res.send();
});

app.get("/slike2", function (req, res) {
	res.write("{\"slika4\" : \"/slikeZaPocetnu/etf4.png\", \"slika5\" : \"/slikeZaPocetnu/etf5.jpg\", \"slika6\" : \"/slikeZaPocetnu/etf6.jpeg\"}");
    res.send();
});

app.get("/slike3", function (req, res) {
	res.write("{\"slika7\" : \"/slikeZaPocetnu/etf7.png\", \"slika8\" : \"/slikeZaPocetnu/etf8.jpeg\", \"slika9\" : \"/slikeZaPocetnu/etf9.jpg\"}");
    res.send();
});

app.get("/slike4", function (req, res) {
	res.write("{\"slika10\" : \"/slikeZaPocetnu/etf10.jpg\"}");
    res.send();
});

app.get("/sale.html", function (req, res) {
	res.sendFile(__dirname + "/sale.html");
});

app.get("/rezervacija.html", function (req, res) {
	res.sendFile(__dirname + "/rezervacija.html");
});

app.get("/unos.html", function (req, res) {
	res.sendFile(__dirname + "/unos.html");
});

app.get("/zauzeca.json", function (req, res) {
	res.sendFile(__dirname + "/zauzeca.json");
});

app.post("/zauzeca.json", function (req, res){
	fs.readFile("zauzeca.json", "utf-8", function(err, data) {
	if (err) throw err
	//var podaci = JSON.parse(data);
    podaci = sveIzBaze;
	let moze1 = 0;
	let moze2 = 0;
	let nalaziSeVanredna = 0;
	let nalaziSePeriodicna = 0;
	let poklapanjeVP = 0;
	let poklapanjePV = 0;

	//potraga za IDem termina
	db.Termin.findAll({ attributes: ['id', 'redovni', 'dan', 'datum', 'semestar', 'pocetak', 'kraj']}).then(function(sviTermini) {
    	let idTermina = 0;
    	idTermina = sviTermini.length;

    //potraga za osobom
    db.Osoblje.findAll({ attributes: ['id', 'ime', 'prezime', 'uloga']}).then(function(sveOsobe) {
    	let idOsobe = 0;
    	for(let i = 0; i < sveOsobe.length; i++){
    		if((sveOsobe[i].ime + " " + sveOsobe[i].prezime) == req.body['predavac']){
    			idOsobe = i;
    			break;
    		}
    	}

    //potraga za salom
    db.Sala.findAll({ attributes: ['id', 'naziv', 'zaduzenaOsoba']}).then(function(sveSale) {
    	let idSale = 0;
    	/*for(let i = 0; i < sveSale.length; i++){
    		if(req.body['naziv'] == sveSale.naziv){
    			idSale = i;
    			break;
    		}
    	}*/
    	/*if(idSale == 0){
    		db.Sala.create({naziv: req.body['naziv'], zaduzenaOsoba: idOsobe + 1});
    		idSale = sveSale.length;
    	}*/

	if(req.body['datum'] != null){
		//ispitivanje da li postoje periodicne kada zelimo vanrednu rezervisat
		let firstDay = (new Date(2019, req.body['datum'].substr(3,2) - 1)).getDay();
		if(firstDay - 1 < 0){
			firstDay += 7;
		}
		let dann = req.body['datum'].substr(0,2) % 7 + firstDay - 1 - 7 - 1;
		if(dann < 0){
			dann += 7;
		}
		for(let i = 0; i < podaci.periodicna.length; i++){
			if(podaci.periodicna[i].naziv == req.body['naziv'] && podaci.periodicna[i].dan == dann){
				if(((req.body['datum'].substr(3,2) <= 12 && req.body['datum'].substr(3,2) >= 10) || (req.body['datum'].substr(3,2) == 1)) && (podaci.periodicna[i].semestar == "zimski")){
					if ((req.body['pocetak'] == podaci.periodicna[i].pocetak || req.body['kraj'] == podaci.periodicna[i].kraj) || (req.body['pocetak'] < podaci.periodicna[i].pocetak && req.body['kraj'] > podaci.periodicna[i].pocetak) || (req.body['pocetak'] > podaci.periodicna[i].pocetak && req.body['pocetak'] < podaci.periodicna[i].kraj)){
    					poklapanjeVP = 1;
    					var ulogaa = "";
    					for(let s = 0; s < sveOsobe.length; s++){
    						if((sveOsobe[s].ime + " " + sveOsobe[s].prezime) == podaci.periodicna[i].predavac){
    							ulogaa = sveOsobe[s].uloga;
    						}
    					}
    					podaci.zauzeto.push({
							zauzetiPredavac: podaci.periodicna[i].predavac,
							uloga: ulogaa
						});
    				}
				}
				else if((req.body['datum'].substr(3,2) >= 2 && req.body['datum'].substr(3,2) <= 6) && (podaci.periodicna[i].semestar == "ljetni")){
					if ((req.body['pocetak'] == podaci.periodicna[i].pocetak || req.body['kraj'] == podaci.periodicna[i].kraj) || (req.body['pocetak'] < podaci.periodicna[i].pocetak && req.body['kraj'] > podaci.periodicna[i].pocetak) || (req.body['pocetak'] > podaci.periodicna[i].pocetak && req.body['pocetak'] < podaci.periodicna[i].kraj)){
    					poklapanjeVP = 1;
    					var ulogaa = "";
    					for(let s = 0; s < sveOsobe.length; s++){
    						if((sveOsobe[s].ime + " " + sveOsobe[s].prezime) == podaci.periodicna[i].predavac){
    							ulogaa = sveOsobe[s].uloga;
    						}
    					}
    					podaci.zauzeto.push({
							zauzetiPredavac: podaci.periodicna[i].predavac,
							uloga: ulogaa
						});
    				}
				}
			}
		}
		if(poklapanjeVP == 0){
			//ispitivanje poklapanja vanrednih
			for(let i = 0; i < podaci.vanredna.length; i++){
				moze1 = 0;
				if(podaci.vanredna[i].naziv == req.body['naziv'] && podaci.vanredna[i].datum.substr(0,6) == req.body['datum'].substr(0,6)){
					//pojednostavljen uslov iz kalendara
					nalaziSeVanredna = 1;
	    			if ((req.body['pocetak'] == podaci.vanredna[i].pocetak || req.body['kraj'] == podaci.vanredna[i].kraj) || (req.body['pocetak'] < podaci.vanredna[i].pocetak && req.body['kraj'] > podaci.vanredna[i].pocetak) || (req.body['pocetak'] > podaci.vanredna[i].pocetak && req.body['pocetak'] < podaci.vanredna[i].kraj)){
	    				moze1 = 1;
	    				var ulogaa = "";
    					for(let s = 0; s < sveOsobe.length; s++){
    						if((sveOsobe[s].ime + " " + sveOsobe[s].prezime) == podaci.vanredna[i].predavac){
    							ulogaa = sveOsobe[s].uloga;
    						}
    					}
    					podaci.zauzeto.push({
							zauzetiPredavac: podaci.vanredna[i].predavac,
							uloga: ulogaa
						});
	    			}
					if(moze1 == 0){
						podaci.vanredna.push({
							datum : req.body['datum'],
							pocetak : req.body['pocetak'],
							kraj : req.body['kraj'],
							naziv : req.body['naziv'],
							//predavac : "predavac1111"
							predavac : req.body['predavac']
						});

						//dodaj u bazu
						db.Sala.create({naziv: req.body['naziv'], zaduzenaOsoba: idOsobe + 1});
    					idSale = sveSale.length;
						db.Termin.create({redovni: 'false', dan: null, datum: req.body['datum'], semestar: null, pocetak: req.body['pocetak'], kraj: req.body['kraj']}).then(function(k){
							db.Rezervacija.create({termin: idTermina + 1, sala: idSale + 1, osoba: idOsobe + 1});
						});
					}
				}
			}
			if(nalaziSeVanredna == 0){
				podaci.vanredna.push({
					datum : req.body['datum'],
					pocetak : req.body['pocetak'],
					kraj : req.body['kraj'],
					naziv : req.body['naziv'],
					//predavac : "predavac1111"
					predavac : req.body['predavac']
				});

				//dodaj u bazu
				db.Sala.create({naziv: req.body['naziv'], zaduzenaOsoba: idOsobe + 1});
    			idSale = sveSale.length;
				db.Termin.create({redovni: 'false', dan: null, datum: req.body['datum'], semestar: null, pocetak: req.body['pocetak'], kraj: req.body['kraj']}).then(function(k){
					db.Rezervacija.create({termin: idTermina + 1, sala: idSale + 1, osoba: idOsobe + 1});
				});
			}
		}
	} else {
		//ispitivanje da li ima poklapanja sa vanrednom
		for(let i = 0; i < podaci.vanredna.length; i++){
			if(podaci.vanredna[i].naziv == req.body['naziv']){
				let firstDay = (new Date(2019, podaci.vanredna[i].datum.substr(3,2) - 1)).getDay();
				if(firstDay - 1 < 0){
					firstDay += 7;
				}
				let dann = podaci.vanredna[i].datum.substr(0,2) % 7 + firstDay - 1 - 7 - 1;
				if(dann < 0){
					dann += 7;
				}

				if(dann == req.body['dan']){
					if(((podaci.vanredna[i].datum.substr(3,2) <= 12 && podaci.vanredna[i].datum.substr(3,2) >= 10) || (podaci.vanredna[i].datum.substr(3,2) == 1)) && (req.body['semestar'] == "zimski")){
						if ((req.body['pocetak'] == podaci.vanredna[i].pocetak || req.body['kraj'] == podaci.vanredna[i].kraj) || (req.body['pocetak'] < podaci.vanredna[i].pocetak && req.body['kraj'] > podaci.vanredna[i].pocetak) || (req.body['pocetak'] > podaci.vanredna[i].pocetak && req.body['pocetak'] < podaci.vanredna[i].kraj)){
	    					poklapanjePV = 1;
	    					var ulogaa = "";
	    					for(let s = 0; s < sveOsobe.length; s++){
	    						if((sveOsobe[s].ime + " " + sveOsobe[s].prezime) == podaci.vanredna[i].predavac){
	    							ulogaa = sveOsobe[s].uloga;
	    						}
	    					}
	    					podaci.zauzeto.push({
								zauzetiPredavac: podaci.vanredna[i].predavac,
								uloga: ulogaa
							});
	    				}
					}
					else if((podaci.vanredna[i].datum.substr(3,2) >= 2 && podaci.vanredna[i].datum.substr(3,2) <= 6) && (req.body['semestar'] == "ljetni")){
						if ((req.body['pocetak'] == podaci.vanredna[i].pocetak || req.body['kraj'] == podaci.vanredna[i].kraj) || (req.body['pocetak'] < podaci.vanredna[i].pocetak && req.body['kraj'] > podaci.vanredna[i].pocetak) || (req.body['pocetak'] > podaci.vanredna[i].pocetak && req.body['pocetak'] < podaci.vanredna[i].kraj)){
	    					poklapanjePV = 1;
	    					var ulogaa = "";
	    					for(let s = 0; s < sveOsobe.length; s++){
	    						if((sveOsobe[s].ime + " " + sveOsobe[s].prezime) == podaci.vanredna[i].predavac){
	    							ulogaa = sveOsobe[s].uloga;
	    						}
	    					}
	    					podaci.zauzeto.push({
								zauzetiPredavac: podaci.vanredna[i].predavac,
								uloga: ulogaa
							});
	    				}
					}
				}
			}
		}

		if(poklapanjePV == 0) {
			//ispitivanje poklapanja periodicnih
			for(let i = 0; i < podaci.periodicna.length; i++){
				moze2 = 0;
				if(podaci.periodicna[i].naziv == req.body['naziv'] && podaci.periodicna[i].dan == req.body['dan'] && podaci.periodicna[i].semestar == req.body['semestar']){
					//pojednostavljen uslov iz kalendara
					nalaziSePeriodicna = 1;
					if ((req.body['pocetak'] == podaci.periodicna[i].pocetak || req.body['kraj'] == podaci.periodicna[i].kraj) || (req.body['pocetak'] < podaci.periodicna[i].pocetak && req.body['kraj'] > podaci.periodicna[i].pocetak) || (req.body['pocetak'] > podaci.periodicna[i].pocetak && req.body['pocetak'] < podaci.periodicna[i].kraj)){
	    				moze2 = 1;
	    				var ulogaa = "";
    					for(let s = 0; s < sveOsobe.length; s++){
    						if((sveOsobe[s].ime + " " + sveOsobe[s].prezime) == podaci.periodicna[i].predavac){
    							ulogaa = sveOsobe[s].uloga;
    						}
    					}
    					podaci.zauzeto.push({
							zauzetiPredavac: podaci.periodicna[i].predavac,
							uloga: ulogaa
						});
	    			}
	    			if(moze2 == 0){
	    				podaci.periodicna.push({
							dan : req.body['dan'],
							semestar : req.body['semestar'],
							pocetak : req.body['pocetak'],
							kraj : req.body['kraj'],
							naziv : req.body['naziv'],
							//predavac : "predavac2222"
							predavac : req.body['predavac']
						});

						//dodaj u bazu
						db.Sala.create({naziv: req.body['naziv'], zaduzenaOsoba: idOsobe + 1});
    					idSale = sveSale.length;
						db.Termin.create({redovni: 'true', dan: req.body['dan'], datum: null, semestar: req.body['semestar'], pocetak: req.body['pocetak'], kraj: req.body['kraj']}).then(function(k){
							db.Rezervacija.create({termin: idTermina + 1, sala: idSale + 1, osoba: idOsobe + 1});
						});
	    			}
				}
			}
			if(nalaziSePeriodicna == 0){
				podaci.periodicna.push({
					dan : req.body['dan'],
					semestar : req.body['semestar'],
					pocetak : req.body['pocetak'],
					kraj : req.body['kraj'],
					naziv : req.body['naziv'],
					//predavac : "predavac2222"
					predavac : req.body['predavac']
				});

				//dodaj u bazu
				db.Sala.create({naziv: req.body['naziv'], zaduzenaOsoba: idOsobe + 1});
    			idSale = sveSale.length;
				db.Termin.create({redovni: 'true', dan: req.body['dan'], datum: null, semestar: req.body['semestar'], pocetak: req.body['pocetak'], kraj: req.body['kraj']}).then(function(k){
					db.Rezervacija.create({termin: idTermina + 1, sala: idSale + 1, osoba: idOsobe + 1});
				});
			}
		}
	}
	res.json(podaci);
	console.log("Uspjesno dodano u bazu!");
	/*fs.writeFile("zauzeca.json", JSON.stringify(podaci), "utf-8", function(err) {
		if (err) throw err
		res.json(podaci);
		console.log("Uspjesno dodano u JSON!");
	})*/
	});
	});
	});
})
});

app.get("/index.js", function (req, res) {
	res.sendFile(__dirname + "/index.js");
});

app.get ('/osoblje' , function (req, res) {
	db.Osoblje.findAll({ attributes: ['id', 'ime', 'prezime', 'uloga']}).then(function(sveOsobe) {
    	res.json(sveOsobe);
    });
});

app.get ('/termini' , function (req, res) {
	db.Termin.findAll({ attributes: ['id', 'redovni', 'dan', 'datum', 'semestar', 'pocetak', 'kraj']}).then(function(sviTermini) {
    	res.json(sviTermini);
    });
});

app.get ('/sale' , function (req, res) {
	db.Sala.findAll({ attributes: ['id', 'naziv', 'zaduzenaOsoba']}).then(function(sveSale) {
    	res.json(sveSale);
    });
});

app.get ('/rezervacije' , function (req, res) {
	db.Rezervacija.findAll({ attributes: ['id', 'termin', 'sala', 'osoba']}).then(function(sveRezervacije) {
    	res.json(sveRezervacije);
    });
});

app.get ('/baza' , function (req, res) {
	let ukupanJSON = { periodicna : [], vanredna : [], zauzeto : []};
	db.Rezervacija.findAll({ include: [ { model: db.Osoblje }, { model: db.Termin }, { model: db.Sala }]}).then(function(sveRezervacije) {
    	for(let i = 0; i < sveRezervacije.length; i++){
    		if(sveRezervacije[i].Termin.redovni == true){
    			var trenutnaSala = {
    				dan: sveRezervacije[i].Termin.dan,
					semestar: sveRezervacije[i].Termin.semestar,
					pocetak: sveRezervacije[i].Termin.pocetak, 
					kraj: sveRezervacije[i].Termin.kraj, 
					naziv: sveRezervacije[i].Sala.naziv, 
					predavac: sveRezervacije[i].Osoblje.ime + " " + sveRezervacije[i].Osoblje.prezime
				};
				ukupanJSON.periodicna.push(trenutnaSala);
    		}
    		else{
    			var trenutnaSala = {
    				datum: sveRezervacije[i].Termin.datum,
					pocetak: sveRezervacije[i].Termin.pocetak,
					kraj: sveRezervacije[i].Termin.kraj,
					naziv: sveRezervacije[i].Sala.naziv,
					predavac: sveRezervacije[i].Osoblje.ime + " " + sveRezervacije[i].Osoblje.prezime
				};
				ukupanJSON.vanredna.push(trenutnaSala);
    		}
    	}
    	sveIzBaze = ukupanJSON;
    	res.json(ukupanJSON);
    });
});

app.get ('/osobljeisale' , function (req, res) {
	let osoblje = { zauzeto : []};
	db.Rezervacija.findAll({ include: [ { model: db.Osoblje }, { model: db.Termin }, { model: db.Sala }]}).then(function(sveRezervacije) {
		var danasnjiDatum = new Date();
		var dd = String(danasnjiDatum.getDate()).padStart(2, '0');
		var mm = String(danasnjiDatum.getMonth() + 1).padStart(2, '0');
		var yyyy = danasnjiDatum.getFullYear();
		var sadasnjiDatum = dd + '.' + mm + '.' + yyyy;

		//kreiranje danasnjeg vremena
		var trenutniSati = danasnjiDatum.getHours();
		if(trenutniSati < 10) trenutniSati = "0" + danasnjiDatum.getHours();
		var trenutneMinute = danasnjiDatum.getMinutes();
		if(trenutneMinute < 10) trenutneMinute = "0" + danasnjiDatum.getMinutes();
		var trenutneSekunde = danasnjiDatum.getSeconds();
		if(trenutneSekunde < 10) trenutneSekunde = "0" + danasnjiDatum.getSeconds();
		var vrijeme = trenutniSati + ":" + trenutneMinute + ":" + trenutneSekunde;
		
		let trenutniSemestar = "";
		if(mm == "01" || mm == "12" || mm == "11" || mm == "10") trenutniSemestar = "zimski";
		else if(mm == "02" || mm == "03" || mm == "04" || mm == "05" || mm == "06") trenutniSemestar = "ljetni";
		var danUSedmici = new Date(2019, danasnjiDatum.getMonth(), danasnjiDatum.getDate()).getDay();
		if(danUSedmici == 0) danUSedmici = 7;

    	for(let i = 0; i < sveRezervacije.length; i++){
    		if(sveRezervacije[i].Termin.redovni == false){
    			//vanredna
    			var upisuj = 0;
    			if(sveRezervacije[i].Termin.datum == sadasnjiDatum){
    				if(vrijeme >= sveRezervacije[i].Termin.pocetak && vrijeme <= sveRezervacije[i].Termin.kraj){
    					upisuj = 1;
    				}
    				if(upisuj == 1){
    					var trenutnoZauzece = {
    						osoba: sveRezervacije[i].Osoblje.ime + " " + sveRezervacije[i].Osoblje.prezime,
    						sala: sveRezervacije[i].Sala.naziv
    					};
    					osoblje.zauzeto.push(trenutnoZauzece);
    				}
    			}
    		}
    		else{
    			//periodicna
    			var upisuj = 0;
    			if((sveRezervacije[i].Termin.semestar == trenutniSemestar) && ((danUSedmici - 1) == sveRezervacije[i].Termin.dan)){
    				if(vrijeme >= sveRezervacije[i].Termin.pocetak && vrijeme <= sveRezervacije[i].Termin.kraj){
    					upisuj = 1;
    				}
    				if(upisuj == 1){
    					var trenutnoZauzece = {
    						osoba: sveRezervacije[i].Osoblje.ime + " " + sveRezervacije[i].Osoblje.prezime,
    						sala: sveRezervacije[i].Sala.naziv
    					};
    					osoblje.zauzeto.push(trenutnoZauzece);
    				}
    			}
    		}
    	}
    	db.Osoblje.findAll({ attributes: ['id', 'ime', 'prezime', 'uloga']}).then(function(sveOsobe) {
    		for(let i = 0; i < sveOsobe.length; i++){
    			var nalazi = 0;
    			for(let j = 0; j < osoblje.zauzeto.length; j++){
    				if((sveOsobe[i].ime + " " + sveOsobe[i].prezime) == osoblje.zauzeto[j].osoba){
    					nalazi = 1;
    				}
    			}
    			if(nalazi == 0){
    				var trenutnoZauzece = {
    						osoba: sveOsobe[i].ime + " " + sveOsobe[i].prezime,
    						sala: "u kancelariji"
    				};
    				osoblje.zauzeto.push(trenutnoZauzece);
    			}
    		}
    		res.json(osoblje);
    	});
    });
});

module.exports = app;
app.listen(8080);

function inicijalizacija(){
	return new Promise(function(resolve,reject){
		//popunjavanje osoba
		db.Osoblje.create({ime: 'Neko', prezime: 'Nekić', uloga: 'profesor'});
		db.Osoblje.create({ime: 'Drugi', prezime: 'Neko', uloga: 'asistent'});
		db.Osoblje.create({ime: 'Test', prezime: 'Test', uloga: 'asistent'});

		//popunjavanje sala
		db.Sala.create({naziv: '1-11', zaduzenaOsoba: 1}).then(function(k){
			db.Sala.create({naziv: '1-15', zaduzenaOsoba: 2});
		});

		//popunjavanje termina
		db.Termin.create({redovni: false, dan: null, datum: '01.01.2020', semestar: null, pocetak: '12:00', kraj: '13:00'});
		db.Termin.create({redovni: true, dan: 0, datum: null, semestar: 'zimski', pocetak: '13:00', kraj: '14:00'});

		//popunjavanjeRezervacije
		db.Rezervacija.create({termin: 1, sala: 1, osoba: 1}).then(function(k){
			db.Rezervacija.create({termin: 2, sala: 1, osoba: 3});
		});

		//popunjavanje svih ostalih sala
		/*db.Sala.create({naziv: '0-01', zaduzenaOsoba: 1});
		db.Sala.create({naziv: '0-02', zaduzenaOsoba: 2});
		db.Sala.create({naziv: '0-03', zaduzenaOsoba: 1});
		db.Sala.create({naziv: '0-04', zaduzenaOsoba: 2});
		db.Sala.create({naziv: '0-05', zaduzenaOsoba: 1});
		db.Sala.create({naziv: '0-06', zaduzenaOsoba: 2});
		db.Sala.create({naziv: '0-07', zaduzenaOsoba: 1});
		db.Sala.create({naziv: '0-08', zaduzenaOsoba: 2});
		db.Sala.create({naziv: '0-09', zaduzenaOsoba: 1});
		db.Sala.create({naziv: '1-01', zaduzenaOsoba: 2});
		db.Sala.create({naziv: '1-02', zaduzenaOsoba: 1});
		db.Sala.create({naziv: '1-03', zaduzenaOsoba: 2});
		db.Sala.create({naziv: '1-04', zaduzenaOsoba: 1});
		db.Sala.create({naziv: '1-05', zaduzenaOsoba: 2});
		db.Sala.create({naziv: '1-06', zaduzenaOsoba: 1});
		db.Sala.create({naziv: '1-07', zaduzenaOsoba: 2});
		db.Sala.create({naziv: '1-08', zaduzenaOsoba: 1});
		db.Sala.create({naziv: '1-09', zaduzenaOsoba: 2});
		db.Sala.create({naziv: '1-10', zaduzenaOsoba: 1});
		db.Sala.create({naziv: '1-12', zaduzenaOsoba: 2});
		db.Sala.create({naziv: '1-13', zaduzenaOsoba: 1});
		db.Sala.create({naziv: '1-14', zaduzenaOsoba: 2});
		db.Sala.create({naziv: 'VA1', zaduzenaOsoba: 1});
		db.Sala.create({naziv: 'VA2', zaduzenaOsoba: 2});
		db.Sala.create({naziv: 'MA', zaduzenaOsoba: 1});
		db.Sala.create({naziv: 'EE1', zaduzenaOsoba: 2});
		db.Sala.create({naziv: 'EE2', zaduzenaOsoba: 1});*/
	});
}