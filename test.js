const supertest = require("supertest");
const assert = require('assert');
const app = require("./index");

describe("GET /osoblje", function() {
  //da li se ispravno poveze sa serverom
  it("status code mora biti 200", function(done) {
    supertest(app)
      .get("/osoblje")
      .expect(200)
      .end(function(err, res){
        if (err) done(err);
        done();
      });
  });

  //test koji kupi sve osobe iz baze
  it("da li findAll vraca sve atribute iz osoblja", function(done) {
    supertest(app)
      .get("/osoblje")
      .expect([
        { id: 1, ime: 'Neko', prezime: 'Nekić', uloga: 'profesor' },
        { id: 2, ime: 'Drugi', prezime: 'Neko', uloga: 'asistent' },
        { id: 3, ime: 'Test', prezime: 'Test', uloga: 'asistent' }
      ])
      .end(function(err, res) {
        if (err) done(err);
        done();
      });  
  });
});

describe("Dohvatanje svih zauzeca", function() {
  //da li se ispravno poveze sa serverom
  it("status code mora biti 200", function(done) {
    supertest(app)
      .get("/baza")
      .expect(200)
      .end(function(err, res){
        if (err) done(err);
        done();
      });
  });

  //test koji testira da li su pocetna zauzeca pokupljena iz baze i ispravna
  it("kupljenje svih zauzeca", function(done) {
    supertest(app)
      .get("/baza")
      .expect({
  		periodicna: [
    	{
      		dan: 0,
      		semestar: 'zimski',
      		pocetak: '13:00:00',
      		kraj: '14:00:00',
      		naziv: '1-11',
      		predavac: 'Test Test'
    	}
  		],
  		vanredna: [
    	{
      		datum: '01.01.2020',
      		pocetak: '12:00:00',
      		kraj: '13:00:00',
      		naziv: '1-11',
      		predavac: 'Neko Nekić'
    	}
  		],
  		zauzeto: []
	  })
      .end(function(err, res) {
        if (err) done(err);
        done();
      });  
  });

  //dodavanje jednog periodicnog zauzeca
  it("Dodavanje periodicne rezervacije u bazu", function(done) {
    supertest(app)
      .post("/zauzeca.json")
      .send({dan: 0, semestar: 'ljetni', pocetak: '12:00', kraj: '14:00', naziv: '0-01', predavac: 'Test Test'})
      .expect(200)
      .end(function(err, res){
        if (err) done(err);
        done();
      });
  });
});

describe("Da li se dodala rezervacija i dohvatanje svih sala", function() {
  //da li se ispravno poveze sa serverom
  it("status code mora biti 200", function(done) {
    supertest(app)
      .get("/sale")
      .expect(200)
      .end(function(err, res){
        if (err) done(err);
        done();
      });
  });
  	//test koji testira da li je periodicna rezervacija iz testa prije dodana u bazu (trebala bi biti)
    it("Provjera da li je dodana rezervacija u bazu", function(done) {
    supertest(app)
      .get("/baza")
      .expect({
		  periodicna: [
		    {
		      dan: 0,
		      semestar: 'zimski',
		      pocetak: '13:00:00',
		      kraj: '14:00:00',
		      naziv: '1-11',
		      predavac: 'Test Test'
		    },
		    {
		      dan: 0,
		      semestar: 'ljetni',
		      pocetak: '12:00:00',
		      kraj: '14:00:00',
		      naziv: '0-01',
		      predavac: 'Test Test'
		    }
		  ],
		  vanredna: [
		    {
		      datum: '01.01.2020',
		      pocetak: '12:00:00',
		      kraj: '13:00:00',
		      naziv: '1-11',
		      predavac: 'Neko Nekić'
		    }
		  ],
		  zauzeto: []
		})
      .end(function(err, res) {
        if (err) done(err);
        done();
      });  
  });

  //kupljenje svih sala iz baze, nakon dodavanja periodicne rezervacije i sale
  it("da li findAll vraca sve atribute iz sala", function(done) {
    supertest(app)
      .get("/sale")
      .expect([
        { id: 1, naziv: '1-11', zaduzenaOsoba: 1 },
        { id: 2, naziv: '1-15', zaduzenaOsoba: 2 },
        { id: 3, naziv: '0-01', zaduzenaOsoba: 3 }
      ])
      .end(function(err, res) {
        if (err) done(err);
        done();
      });  
  });
});

describe("Dodavanje istog zauzeca (ne smije se dodati u bazu)", function() {
	//ponovljen test za dodavanje istog zauzeca
	it("Dodavanje periodicne rezervacije u bazu", function(done) {
    supertest(app)
      .post("/zauzeca.json")
      .send({dan: 0, semestar: 'zimski', pocetak: '13:00', kraj: '14:00', naziv: '1-11', predavac: 'Test Test'})
      .expect(200)
      .end(function(err, res){
        if (err) done(err);
        done();
      });
  });
});

describe("Da li se dodala rezervacija (ne bi trebalo)", function() {
  //da li se ispravno poveze sa serverom
  it("status code mora biti 200", function(done) {
    supertest(app)
      .get("/sale")
      .expect(200)
      .end(function(err, res){
        if (err) done(err);
        done();
      });
  });

  	//isti test koji provjerava da li je stanje u bazi ostalo isto nakon dodavanja neispravnog zauzeca
    it("Provjera da li je dodana rezervacija u bazu", function(done) {
    supertest(app)
      .get("/baza")
      .expect({
		  periodicna: [
		    {
		      dan: 0,
		      semestar: 'zimski',
		      pocetak: '13:00:00',
		      kraj: '14:00:00',
		      naziv: '1-11',
		      predavac: 'Test Test'
		    },
		    {
		      dan: 0,
		      semestar: 'ljetni',
		      pocetak: '12:00:00',
		      kraj: '14:00:00',
		      naziv: '0-01',
		      predavac: 'Test Test'
		    }
		  ],
		  vanredna: [
		    {
		      datum: '01.01.2020',
		      pocetak: '12:00:00',
		      kraj: '13:00:00',
		      naziv: '1-11',
		      predavac: 'Neko Nekić'
		    }
		  ],
		  zauzeto: []
		})
      .end(function(err, res) {
        if (err) done(err);
        done();
      });  
  });
});