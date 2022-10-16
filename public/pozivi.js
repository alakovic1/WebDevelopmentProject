let periodicnaSalaJSON = new Array();
let vanrednaSalaJSON = new Array();

let listaOsoblja = new Array();
let listaTermina = new Array();
let listaRezervacija = new Array();
let listaSala = new Array();

let Pozivi = (function(){

    function ucitajPodatkeJSONImpl() {
       let httpRequest = new XMLHttpRequest();
       periodicnaSalaJSON = new Array();
       vanrednaSalaJSON = new Array();
       httpRequest.onreadystatechange = function () {
           if(httpRequest.readyState == 4 && httpRequest.status == 200){
                let podaci = JSON.parse(httpRequest.response);
                $.each(podaci.periodicna, function(){
                    var trenutnaSala = {
                      dan:this['dan'], 
                      semestar:this['semestar'], 
                      pocetak:this['pocetak'], 
                      kraj:this['kraj'], 
                      naziv:this['naziv'], 
                      predavac:this['predavac']
                    }
                    periodicnaSalaJSON.push(trenutnaSala);
                });
                $.each(podaci.vanredna, function(){
                    var trenutnaSala = {
                      datum:this['datum'], 
                      pocetak:this['pocetak'], 
                      kraj:this['kraj'], 
                      naziv:this['naziv'], 
                      predavac:this['predavac']
                    }
                    vanrednaSalaJSON.push(trenutnaSala);
                });
                Kalendar.ucitajPodatke(periodicnaSalaJSON, vanrednaSalaJSON);
                onPromjena();             
           }
       }
       httpRequest.open("GET", "zauzeca.json", true);
       httpRequest.send();
    }

    function dodajZauzeceJSONImpl(json){
       let httpRequest = new XMLHttpRequest();
       httpRequest.open("POST", "zauzeca.json", true);
       httpRequest.setRequestHeader("Content-Type","application/json");
       httpRequest.send(json);

       httpRequest.onreadystatechange = function () {
           if(httpRequest.readyState == 4 && httpRequest.status == 200){
                let podaci = JSON.parse(httpRequest.response);
                let brojStarihVanrednih = vanrednaSalaJSON.length;
                let brojStarihPeriodicnih = periodicnaSalaJSON.length;
                //Pozivi.ucitajPodatkeJSON();
                Pozivi.ucitajIzBaze();
                onPromjena();
                let brojNovihVanrednih = podaci.vanredna.length;
                let brojNovihPeriodicnih = podaci.periodicna.length;
                let json2 = JSON.parse(json);
                if(json2['datum'] != null){
                  if(brojStarihVanrednih == brojNovihVanrednih){
                    alert("Nije moguće rezervisati salu " + json2['naziv'] + " za navedeni datum " + json2['datum'].substr(0,2) + "/" + json2['datum'].substr(3,2) + "/" + json2['datum'].substr(6,4) + " i termin od " + json2['pocetak'] + " do " + json2['kraj'] + ". Salu je rezervisao " + podaci.zauzeto[0].zauzetiPredavac + " (" + podaci.zauzeto[0].uloga + ")!");
                    onPromjena();
                  }
                }
                else{
                  if(brojStarihPeriodicnih == brojNovihPeriodicnih){
                    alert("Nije moguće rezervisati salu " + json2['naziv'] + " za navedeni datum i termin od " + json2['pocetak'] + " do " + json2['kraj'] + ". Salu je rezervisao " + podaci.zauzeto[0].zauzetiPredavac + " (" + podaci.zauzeto[0].uloga + ")!");
                    onPromjena();
                  }
                }
           }
       }
    }

    function ucitajSlikeImpl(i) {
         let httpRequest = new XMLHttpRequest();
         httpRequest.onreadystatechange = function () {
         if(httpRequest.readyState == 4 && httpRequest.status == 200){
              let podaci = JSON.parse(httpRequest.responseText);
              if(i == 1) {
                document.getElementsByClassName("sadrzaj")[0].innerHTML = "<div class=\"grid\"><img src=\"" + podaci['slika1'] + "\" class =\"slika\" alt=\"etf1\"><img src=\"" + podaci['slika2'] + "\" class =\"slika\" alt=\"etf2\"><img src=\" " + podaci['slika3'] + " \" class =\"slika\" alt=\"etf3\"></div><button class=\"dugme dPret\" onclick=\"prethodni()\">Prethodni</button><button class=\"dugme dSljed\" onclick=\"sljedeci()\">Sljedeći</button>";
                listaStarihSlika.push(podaci['slika1']);
                listaStarihSlika.push(podaci['slika2']);
                listaStarihSlika.push(podaci['slika3']);
              }
              else if(i == 2) {
                document.getElementsByClassName("sadrzaj")[0].innerHTML = "<div class=\"grid\"><img src=\"" + podaci['slika4'] + "\" class =\"slika\" alt=\"etf1\"><img src=\"" + podaci['slika5'] + "\" class =\"slika\" alt=\"etf2\"><img src=\" " + podaci['slika6'] + " \" class =\"slika\" alt=\"etf3\"></div><button class=\"dugme dPret\" onclick=\"prethodni()\">Prethodni</button><button class=\"dugme dSljed\" onclick=\"sljedeci()\">Sljedeći</button>";
                listaStarihSlika.push(podaci['slika4']);
                listaStarihSlika.push(podaci['slika5']);
                listaStarihSlika.push(podaci['slika6']);
              }
              else if(i == 3) {
                document.getElementsByClassName("sadrzaj")[0].innerHTML = "<div class=\"grid\"><img src=\"" + podaci['slika7'] + "\" class =\"slika\" alt=\"etf1\"><img src=\"" + podaci['slika8'] + "\" class =\"slika\" alt=\"etf2\"><img src=\" " + podaci['slika9'] + " \" class =\"slika\" alt=\"etf3\"></div><button class=\"dugme dPret\" onclick=\"prethodni()\">Prethodni</button><button class=\"dugme dSljed\" onclick=\"sljedeci()\">Sljedeći</button>";
                listaStarihSlika.push(podaci['slika7']);
                listaStarihSlika.push(podaci['slika8']);
                listaStarihSlika.push(podaci['slika9']);
              }
              else {
                document.getElementsByClassName("sadrzaj")[0].innerHTML = "<div class=\"grid\"><img src=\"" + podaci['slika10'] + "\" class =\"slika\" alt=\"etf1\"></div><button class=\"dugme dPret\" onclick=\"prethodni()\">Prethodni</button><button class=\"dugme dSljed\" onclick=\"sljedeci()\">Sljedeći</button>";
                listaStarihSlika.push(podaci['slika10']);
              }
            }
         }
         httpRequest.open("GET", "slike" + i, true);
         httpRequest.send();
    }

    function ucitajOsobljeImpl() {
       let httpRequest = new XMLHttpRequest();
       httpRequest.onreadystatechange = function () {
           if(httpRequest.readyState == 4 && httpRequest.status == 200){
                let podaci = JSON.parse(httpRequest.response);
                var selectOsoba = document.getElementsByClassName("sveOsobe")[0];
                for(let i = 0; i < podaci.length; i++){
                  var option = document.createElement("option");
                  option.text = podaci[i]['ime'] + " " + podaci[i]['prezime'];
                  selectOsoba.add(option);  
                }      
           }
       }
       httpRequest.open("GET", "osoblje", true);
       httpRequest.send();
    }

    function ucitajSvoOsobljeImpl() {
       let httpRequest = new XMLHttpRequest();
       httpRequest.onreadystatechange = function () {
           if(httpRequest.readyState == 4 && httpRequest.status == 200){
                let podaci = JSON.parse(httpRequest.response);
                //console.log("SVE OSOBEE");
                //console.log(podaci);      
           }
       }
       httpRequest.open("GET", "osoblje", true);
       httpRequest.send();
    }

    function ucitajTermineImpl() {
       let httpRequest = new XMLHttpRequest();
       httpRequest.onreadystatechange = function () {
           if(httpRequest.readyState == 4 && httpRequest.status == 200){
                let podaci = JSON.parse(httpRequest.response);
                //console.log("SVI TERMINII");
                //console.log(podaci);       
           }
       }
       httpRequest.open("GET", "termini", true);
       httpRequest.send();
    }

    function ucitajSaleImpl() {
       let httpRequest = new XMLHttpRequest();
       httpRequest.onreadystatechange = function () {
           if(httpRequest.readyState == 4 && httpRequest.status == 200){
                let podaci = JSON.parse(httpRequest.response);
                //console.log("SVE SALEE");
                //console.log(podaci);       
           }
       }
       httpRequest.open("GET", "sale", true);
       httpRequest.send();
    }

    function ucitajRezervacijeImpl() {
       let httpRequest = new XMLHttpRequest();
       httpRequest.onreadystatechange = function () {
           if(httpRequest.readyState == 4 && httpRequest.status == 200){
                let podaci = JSON.parse(httpRequest.response);
                //console.log("SVE REZERVACIJEE");
                //console.log(podaci);  
           }
       }
       httpRequest.open("GET", "rezervacije", true);
       httpRequest.send();
    }

    function ucitajIzBazeImpl(){
       let httpRequest = new XMLHttpRequest();
       periodicnaSalaJSON = new Array();
       vanrednaSalaJSON = new Array();
       httpRequest.onreadystatechange = function () {
           if(httpRequest.readyState == 4 && httpRequest.status == 200){
              let podaci = JSON.parse(httpRequest.response);
              $.each(podaci.periodicna, function(){
                    var trenutnaSala = {
                      dan:this['dan'], 
                      semestar:this['semestar'], 
                      pocetak:this['pocetak'], 
                      kraj:this['kraj'], 
                      naziv:this['naziv'], 
                      predavac:this['predavac']
                    }
                    periodicnaSalaJSON.push(trenutnaSala);
                });
                $.each(podaci.vanredna, function(){
                    var trenutnaSala = {
                      datum:this['datum'], 
                      pocetak:this['pocetak'], 
                      kraj:this['kraj'], 
                      naziv:this['naziv'], 
                      predavac:this['predavac']
                    }
                    vanrednaSalaJSON.push(trenutnaSala);
                });
                Kalendar.ucitajPodatke(periodicnaSalaJSON, vanrednaSalaJSON);
                onPromjena();
           }
       }
       httpRequest.open("GET", "baza", true);
       httpRequest.send();
    }

    function ucitajOsobljeISaleImpl(){
       let httpRequest = new XMLHttpRequest();
       periodicnaSalaJSON = new Array();
       vanrednaSalaJSON = new Array();
       httpRequest.onreadystatechange = function () {
           if(httpRequest.readyState == 4 && httpRequest.status == 200){
              let podaci = JSON.parse(httpRequest.response);
              popuniTabelu(podaci);
           }
       }
       httpRequest.open("GET", "osobljeisale", true);
       httpRequest.send();
    }

    return {
        ucitajPodatkeJSON: ucitajPodatkeJSONImpl,
        dodajZauzeceJSON : dodajZauzeceJSONImpl,
        ucitajSlike : ucitajSlikeImpl,
        ucitajOsoblje: ucitajOsobljeImpl,
        ucitajSale : ucitajSaleImpl,
        ucitajTermine : ucitajTermineImpl,
        ucitajRezervacije : ucitajRezervacijeImpl,
        ucitajSvoOsoblje : ucitajSvoOsobljeImpl,
        ucitajIzBaze : ucitajIzBazeImpl,
        ucitajOsobljeISale : ucitajOsobljeISaleImpl
    }
}());