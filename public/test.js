let assert = chai.assert;
describe('Kalendar', function() {
 describe('iscrtajKalendar()', function() {
   it('treba izbrojati 31 dan za decembar', function() {
     //test za mjesec koji ima 31 dan, da ima 31 (u ovom slucaju decembar)
     document.getElementsByClassName("kalendar")[0].innerHTML = "";
     Kalendar.iscrtajKalendar(document.getElementsByClassName("kalendar")[0],11);
     let tabele = document.getElementsByTagName("table");
     let tabela = tabele[0];
     let brojDana = 0;
     for(let i = 0; i < 44; i++){
        if(document.querySelectorAll("body>div>div>table>tr>td")[i].className == "unutrasnjaTabela") brojDana++;
     }
     assert.equal(brojDana, 31,"Broj dana treba biti 31");
   });
   it('treba izbrojati 30 dan za novembar', function() {
     //test za mjesec koji ima 30 dana, da ima 30 (u ovom slucaju novembar)
     document.getElementsByClassName("kalendar")[0].innerHTML = "";
     Kalendar.iscrtajKalendar(document.getElementsByClassName("kalendar")[0],10);
     let tabele = document.getElementsByTagName("table");
     let tabela = tabele[0];
     let brojDana = 0;
     for(let i = 0; i < 41; i++){
        if(document.querySelectorAll("body>div>div>table>tr>td")[i].className == "unutrasnjaTabela") brojDana++;
     }
     assert.equal(brojDana, 30,"Broj dana treba biti 30");
   });
   it('prvi dan za trenutni mjesec novembar pada na petak', function() {
     //test za testiranje pocetnog dana za trenutni mjesec
     let danas = new Date();
     let trenutniMjesec = danas.getMonth();
     document.getElementsByClassName("kalendar")[0].innerHTML = "";
     Kalendar.iscrtajKalendar(document.getElementsByClassName("kalendar")[0],10);
     let tabele = document.getElementsByTagName("table");
     let tabela = tabele[0];
     let prviDan = 0;
     for(let i = 0; i < 41; i++){
        if(document.querySelectorAll("body>div>div>table>tr>td")[i].className == "unutrasnjaTabela") {
          prviDan = i;
          break;
        }
     }
    assert.equal(prviDan - 7, 4,"Ako je prvi petak, treba da vraca 4 (jer pocinje od 0)");
   });
   it('zadnji dan za trenutni mjesec je subota', function() {
     //test za testiranje zadnjeg dana za trenutni mjesec
     let danas = new Date();
     let trenutniMjesec = danas.getMonth();
     document.getElementsByClassName("kalendar")[0].innerHTML = "";
     Kalendar.iscrtajKalendar(document.getElementsByClassName("kalendar")[0],10);
     let tabele = document.getElementsByTagName("table"); 
     let tabela = tabele[0];
     let datumIduciMjesec = new Date(2019, 10 + 1,1);
     let zadnjiDanUSedmici = new Date(datumIduciMjesec - 1).getDay();  
     assert.equal(zadnjiDanUSedmici, 6,"Broj zadnjeg dana je subota, treba biti 6"); //ispitivanje da li je dobro racuna zadnji dan
     let redovi = tabela.getElementsByTagName("tr");
     let kolone = redovi[53].getElementsByTagName("td");
     assert.equal(kolone[15].getElementsByTagName("tr")[0].getElementsByTagName("td")[0].innerText, 30,"Ako kolona ima vrijednost 30, onda pocinje na subotu jer novembar ima 30 dana");
   });
   it('testira za januar, trebaju biti brojevi do 1 - 31', function() {
     document.getElementsByClassName("kalendar")[0].innerHTML = "";
     Kalendar.iscrtajKalendar(document.getElementsByClassName("kalendar")[0],0);
     let tabele = document.getElementsByTagName("table");
     let tabela = tabele[0];
     let pomocna = 1;
     for(let i = 0; i < 39; i++){
        if(document.querySelectorAll("body>div>div>table>tr>td")[i].className == "unutrasnjaTabela") {
          assert.equal(document.querySelectorAll("body>div>div>table>tr>td")[i].getElementsByTagName("tr")[0].innerText, pomocna++, "Ispitivanje da li je svaki dan 1-31");
        }
     }
   });
   it('broji broj dana u prvoj sedmici marta', function() {
     //test za brojanje broja dana u prvoj sedmici za mart
     document.getElementsByClassName("kalendar")[0].innerHTML = "";
     Kalendar.iscrtajKalendar(document.getElementsByClassName("kalendar")[0],2);
     let tabele = document.getElementsByTagName("table");
     let tabela = tabele[0];
     let redovi = tabela.children.length * 7; // broj redova * ukupno da se kreira citav kalendar
     let prvaSedmica = redovi - 5 * 7;
     let ukupnoDanaPrveSedmice = 7 - ((new Date(2019, 2)).getDay() - 1);
     assert.equal(ukupnoDanaPrveSedmice, 3,"Broj dana treba biti 3");
   });
   it('broji broj redova za decembar, treba biti 6 bez imena dana', function() {
     //test za brojanja redova za decembar
     document.getElementsByClassName("kalendar")[0].innerHTML = "";
     Kalendar.iscrtajKalendar(document.getElementsByClassName("kalendar")[0],11);
     let tabele = document.getElementsByTagName("table");
     let tabela = tabele[0];
     let redovi = tabela.children;
     assert.equal(redovi.length - 1, 6,"Broj redova treba biti 6");
   });
 });
 describe('ucitajPodatke() i obojiZauzeca()', function() {
   it('ne boji u crveno kada podaci nisu ucitani', function() {
     document.getElementsByClassName("kalendar")[0].innerHTML = "";
     Kalendar.iscrtajKalendar(document.getElementsByClassName("kalendar")[0],10);
     let tabele = document.getElementsByTagName("table");
     let tabela = tabele[0];
     //Kalendar.ucitajPodatke([],[]);
     Kalendar.obojiZauzeca(document.getElementsByClassName("kalendar")[0], 10, "0-01", "12:00", "15:00");
     let brojObojenihUCrveno = tabela.querySelectorAll(".zauzeta").length;
     assert.equal(brojObojenihUCrveno, 0,"Nula je zauzetih, nema obojenih u crveno");
   });
   it('dupla zauzeca, razlicite sale na isti termin (periodicne)', function() {
     document.getElementsByClassName("kalendar")[0].innerHTML = "";
     Kalendar.iscrtajKalendar(document.getElementsByClassName("kalendar")[0],10);
     let tabele = document.getElementsByTagName("table");
     let tabela = tabele[0];
     Kalendar.ucitajPodatke([{
			dan: 5,
			semestar: "zimski",
			pocetak: "12:00", 
			kraj: "15:00", 
			naziv: "0-02", 
			predavac: "predavac1"
		}, {
			dan: 5,
			semestar: "zimski",
			pocetak: "12:00", 
			kraj: "15:00", 
			naziv: "MA", 
			predavac: "predavac2"
		}],[]);
     Kalendar.obojiZauzeca(document.getElementsByClassName("kalendar")[0], 10, "MA", "12:00", "15:00");
     let brojObojenihUCrveno = tabela.querySelectorAll(".zauzeta").length;
     assert.equal(brojObojenihUCrveno, 5,"Treba biti obojena sedmica subota");
   });
   it('zauzece za drugi semestar', function() {
     document.getElementsByClassName("kalendar")[0].innerHTML = "";
     Kalendar.iscrtajKalendar(document.getElementsByClassName("kalendar")[0],10);
     let tabele = document.getElementsByTagName("table");
     let tabela = tabele[0];
     //0-01 se boji u ljetnom semestru, novembar je zimski
     Kalendar.ucitajPodatke([{
      dan: 5,
      semestar: "ljetni",
      pocetak: "12:00", 
      kraj: "15:00", 
      naziv: "0-01", 
      predavac: "predavac1"
    }],[]);
     Kalendar.obojiZauzeca(document.getElementsByClassName("kalendar")[0], 10, "0-01", "12:00", "15:00");
     //let brojObojenihUCrveno = tabela.querySelectorAll(".zauzeta").length;
     let brojObojenihUCrveno = tabela.querySelectorAll(".zauzeta").length;
     assert.equal(brojObojenihUCrveno, 0,"Ne treba biti obojeno");
   });
   it('zauzece za drugi mjesec', function() {
     document.getElementsByClassName("kalendar")[0].innerHTML = "";
     Kalendar.iscrtajKalendar(document.getElementsByClassName("kalendar")[0],10);
     let tabele = document.getElementsByTagName("table");
     let tabela = tabele[0];
     Kalendar.ucitajPodatke([{
      dan: 5,
      semestar: "ljetni",
      pocetak: "12:00", 
      kraj: "15:00", 
      naziv: "0-01", 
      predavac: "predavac1"
    }],[{
      datum: "22.02.2019",
      pocetak: "10:00",
      kraj: "12:00",
      naziv: "EE1",
      predavac: "predavac2"
    }]);
     //vanredna se pretrazuje, ali se ona boji u februaru, a ne u novembru
     Kalendar.obojiZauzeca(document.getElementsByClassName("kalendar")[0], 10, "EE1", "10:00", "12:00");
     let brojObojenihUCrveno = tabela.querySelectorAll(".zauzeta").length;
     assert.equal(brojObojenihUCrveno, 0,"Ne treba biti nista obojeno");
   });
   it('citav mjesec zauzet', function() {
     document.getElementsByClassName("kalendar")[0].innerHTML = "";
     Kalendar.iscrtajKalendar(document.getElementsByClassName("kalendar")[0],10);
     let tabele = document.getElementsByTagName("table");
     let tabela = tabele[0];
     Kalendar.ucitajPodatke([{
      dan: 0,
      semestar: "zimski",
      pocetak: "12:00", 
      kraj: "15:00", 
      naziv: "0-01", 
      predavac: "predavac1"
    },{
      dan: 1,
      semestar: "zimski",
      pocetak: "12:00", 
      kraj: "15:00", 
      naziv: "0-01", 
      predavac: "predavac1"
    },{
      dan: 2,
      semestar: "zimski",
      pocetak: "12:00", 
      kraj: "15:00", 
      naziv: "0-01", 
      predavac: "predavac1"
    },{
      dan: 3,
      semestar: "zimski",
      pocetak: "12:00", 
      kraj: "15:00", 
      naziv: "0-01", 
      predavac: "predavac1"
    },{
      dan: 4,
      semestar: "zimski",
      pocetak: "12:00", 
      kraj: "15:00", 
      naziv: "0-01", 
      predavac: "predavac1"
    },{
      dan: 5,
      semestar: "zimski",
      pocetak: "12:00", 
      kraj: "15:00", 
      naziv: "0-01", 
      predavac: "predavac1"
    },{
      dan: 6,
      semestar: "zimski",
      pocetak: "12:00", 
      kraj: "15:00", 
      naziv: "0-01", 
      predavac: "predavac1"
    }],[]);
     //vanredna se pretrazuje, ali se ona boji u februaru, a ne u novembru
     Kalendar.obojiZauzeca(document.getElementsByClassName("kalendar")[0], 10, "0-01", "12:00", "15:00");
     //let brojObojenihUCrveno = tabela.querySelectorAll(".zauzeta").length;
     let brojObojenihUCrveno = tabela.querySelectorAll(".zauzeta").length;
     assert.equal(brojObojenihUCrveno, 30,"Treba biti sve obojeno u crveno");
   });
   it('duplo pozivanje obojiZauzeca nad istim zauzecem', function() {
     document.getElementsByClassName("kalendar")[0].innerHTML = "";
     Kalendar.iscrtajKalendar(document.getElementsByClassName("kalendar")[0],10);
     let tabele = document.getElementsByTagName("table");
     let tabela = tabele[0];
     Kalendar.ucitajPodatke([{
      dan: 5,
      semestar: "ljetni",
      pocetak: "12:00", 
      kraj: "15:00", 
      naziv: "0-01", 
      predavac: "predavac1"
    }],[{
      datum: "22.11.2019",
      pocetak: "10:00",
      kraj: "12:00",
      naziv: "EE1",
      predavac: "predavac2"
    }]);
     //vanredna se pretrazuje, ali se ona boji u februaru, a ne u novembru
     Kalendar.obojiZauzeca(document.getElementsByClassName("kalendar")[0], 10, "EE1", "10:00", "12:00");
     //ispitivanje da li je klasa zauzeta
     assert.equal(document.querySelectorAll("body>div>div>table>tr>td")[32].getElementsByTagName("td")[1].className, "zauzeta","Treba biti obojena sedmica subota");
     Kalendar.obojiZauzeca(document.getElementsByClassName("kalendar")[0], 10, "EE1", "10:00", "12:00");
     //da li je ista ostala zauzeta nakon ponovnog pozivanja funkcije
     assert.equal(document.querySelectorAll("body>div>div>table>tr>td")[32].getElementsByTagName("td")[1].className, "zauzeta","Treba biti obojena sedmica subota");
   });
   it('dupla pozivanja obje funkcije', function() {
     document.getElementsByClassName("kalendar")[0].innerHTML = "";
     Kalendar.iscrtajKalendar(document.getElementsByClassName("kalendar")[0],10);
     let tabele = document.getElementsByTagName("table");
     let tabela = tabele[0];
     Kalendar.ucitajPodatke([],[{
      datum: "22.11.2019",
      pocetak: "10:00",
      kraj: "12:00",
      naziv: "EE1",
      predavac: "predavac2"
    }]);
     //vanredna se pretrazuje, ali se ona boji u februaru, a ne u novembru
     Kalendar.obojiZauzeca(document.getElementsByClassName("kalendar")[0], 10, "EE1", "10:00", "12:00");
     //ispitivanje da li je klasa zauzeta prilikom prvog ucitavanje
     assert.equal(document.querySelectorAll("body>div>div>table>tr>td")[32].getElementsByTagName("td")[1].className, "zauzeta","Treba biti obojena sedmica subota");
     //posto mi se ne cisti u oboji sve, ovdje se cisti i opet ucitavaju svi podaci, te crtaju...
     document.getElementsByClassName("kalendar")[0].innerHTML = "";
     Kalendar.iscrtajKalendar(document.getElementsByClassName("kalendar")[0],10);
     Kalendar.ucitajPodatke([],[{
      datum: "10.11.2019",
      pocetak: "14:00",
      kraj: "16:00",
      naziv: "EE2",
      predavac: "predavac2"
    }]);
     Kalendar.obojiZauzeca(document.getElementsByClassName("kalendar")[0], 10, "EE2", "14:00", "16:00");
     //ispitivanje da li je klasa zauzeta prilikom drugog ucitavanje
     assert.equal(document.querySelectorAll("body>div>div>table>tr>td")[20].getElementsByTagName("td")[1].className, "zauzeta","Treba biti obojena sedmica subota");
   });
   it('neispravan unos za dan', function() {
     document.getElementsByClassName("kalendar")[0].innerHTML = "";
     Kalendar.iscrtajKalendar(document.getElementsByClassName("kalendar")[0],10);
     let tabele = document.getElementsByTagName("table");
     let tabela = tabele[0];
     Kalendar.ucitajPodatke([{
      dan: 10,
      semestar: "zimski",
      pocetak: "12:00", 
      kraj: "15:00", 
      naziv: "0-01", 
      predavac: "predavac1"
    }],[]);
     //pretrazuje se slucaj kada je dan neispravan
     Kalendar.obojiZauzeca(document.getElementsByClassName("kalendar")[0], 10, "0-01", "12:00", "15:00");
     let brojObojenihUCrveno = tabela.querySelectorAll(".zauzeta").length;
     assert.equal(brojObojenihUCrveno, 0,"Ne treba biti nista obojeno jer nije dodano u listu");
   });
   it('zauzece koje se ne poklapa sa nekim iz podataka', function() {
     document.getElementsByClassName("kalendar")[0].innerHTML = "";
     Kalendar.iscrtajKalendar(document.getElementsByClassName("kalendar")[0],10);
     let tabele = document.getElementsByTagName("table");
     let tabela = tabele[0];
     Kalendar.ucitajPodatke([{
      dan: 5,
      semestar: "zimski",
      pocetak: "12:00", 
      kraj: "15:00", 
      naziv: "0-01", 
      predavac: "predavac1"
    }],[]);
     //ispituje se slucaj kada se termini ne poklapaju
     Kalendar.obojiZauzeca(document.getElementsByClassName("kalendar")[0], 10, "0-01", "15:00", "17:00");
     let brojObojenihUCrveno = tabela.querySelectorAll(".zauzeta").length;
     assert.equal(brojObojenihUCrveno, 0,"Ne treba biti nista obojeno");
   });
 });
});
