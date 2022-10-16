//Pozivi.ucitajPodatkeJSON();
Pozivi.ucitajIzBaze();
//Pozivi.ucitajSvoOsoblje();
//Pozivi.ucitajSale();
//Pozivi.ucitajTermine();
//Pozivi.ucitajRezervacije();
Pozivi.ucitajOsoblje();

//console.log(periodicnaSalaJSON.length);

//Kalendar.ucitajPodatke(periodicnaSalaJSON, vanrednaSalaJSON);

document.getElementsByClassName("kalendar")[0].innerHTML = "";
Kalendar.iscrtajKalendar(document.getElementsByClassName("kalendar")[0], trenutniMjesec);

let sala = document.getElementsByClassName("sveSale")[0].value;
let pocetak = document.getElementById("pocetak").value;
let kraj = document.getElementById("kraj").value;

document.getElementById("divUnosa").addEventListener("change", onPromjena);

function onPromjena(){
	//prilikom svakog refresha opet se podaci crtaju pa boje
	document.getElementsByClassName("kalendar")[0].innerHTML = "";
	Kalendar.iscrtajKalendar(document.getElementsByClassName("kalendar")[0], trenutniMjesec);
	Kalendar.obojiZauzeca(document.getElementsByClassName("kalendar")[0], trenutniMjesec, document.getElementsByClassName("sveSale")[0].value, document.getElementById("pocetak").value, document.getElementById("kraj").value);

	if(document.getElementById("pocetak").value.length != 0 && document.getElementById("kraj").value.length != 0){
		//pozivanje drugog listenera
		document.getElementsByClassName("kalendar")[0].querySelectorAll("table>tr>td").forEach(dan => dan.addEventListener("click", function(){
			var r = confirm("Da li želite da rezervišete ovaj termin?");
			if(r == true){
				//pritisnuli smo okej...
				//provjeravaj zauzeca...
				if(document.getElementById("checkZaPeriodicnu").checked){
					//periodicne
					let firstDay = (new Date(2019, trenutniMjesec)).getDay();
					if(firstDay - 1 < 0){
				        firstDay += 7;
				    }
					let dann = dan.querySelectorAll("tr>td")[0].innerText % 7 + firstDay - 1 - 7 - 1;
					if(dann < 0){
				        dann += 7;
				    }
					if(document.querySelector(".tekst").innerText == "Februar" || document.querySelector(".tekst").innerText == "Mart" || document.querySelector(".tekst").innerText == "April" || document.querySelector(".tekst").innerText == "Maj" || document.querySelector(".tekst").innerText == "Juni"){
						let string = "{\"dan\": " + dann + " ,\"semestar\":\"ljetni\",\"pocetak\":\"" + document.getElementById("pocetak").value + "\",\"kraj\":\"" + document.getElementById("kraj").value + "\",\"naziv\":\"" + document.getElementsByClassName("sveSale")[0].value + "\",\"predavac\":\"" + document.getElementsByClassName("sveOsobe")[0].value + "\"}";						
						Pozivi.dodajZauzeceJSON(string);
					} else if(document.querySelector(".tekst").innerText == "Oktobar" || document.querySelector(".tekst").innerText == "Novembar" || document.querySelector(".tekst").innerText == "Decembar" || document.querySelector(".tekst").innerText == "Januar"){
						let string = "{\"dan\":" + dann + ",\"semestar\":\"zimski\",\"pocetak\":\"" + document.getElementById("pocetak").value + "\",\"kraj\":\"" + document.getElementById("kraj").value + "\",\"naziv\":\"" + document.getElementsByClassName("sveSale")[0].value + "\",\"predavac\":\"" + document.getElementsByClassName("sveOsobe")[0].value + "\"}";
						Pozivi.dodajZauzeceJSON(string);
					}
				}
				else{
					//vanredne
					let mjesecZaUpis = trenutniMjesec + 1;
					if(dan.querySelectorAll("tr>td")[0].innerText < 10 && mjesecZaUpis < 10){
						let string = "{\"datum\": \"0" + dan.querySelectorAll("tr>td")[0].innerText + ".0" + mjesecZaUpis + "." + "2020" + "\", \"pocetak\": \"" + document.getElementById("pocetak").value + "\", \"kraj\": \"" + document.getElementById("kraj").value + "\", \"naziv\": \"" + document.getElementsByClassName("sveSale")[0].value + "\", \"predavac\": \"" + document.getElementsByClassName("sveOsobe")[0].value + "\"}";
						Pozivi.dodajZauzeceJSON(string);
					}
					else if(dan.querySelectorAll("tr>td")[0].innerText < 10 && mjesecZaUpis >= 10){
						let string = "{\"datum\": \"0" + dan.querySelectorAll("tr>td")[0].innerText + "." + mjesecZaUpis + "." + "2020" + "\", \"pocetak\": \"" + document.getElementById("pocetak").value + "\", \"kraj\": \"" + document.getElementById("kraj").value + "\", \"naziv\": \"" + document.getElementsByClassName("sveSale")[0].value + "\", \"predavac\": \"" + document.getElementsByClassName("sveOsobe")[0].value + "\"}";
						Pozivi.dodajZauzeceJSON(string);
					}
					else if(dan.querySelectorAll("tr>td")[0].innerText >= 10 && mjesecZaUpis < 10){
						let string = "{\"datum\": \"" + dan.querySelectorAll("tr>td")[0].innerText + ".0" + mjesecZaUpis + "." + "2020" + "\", \"pocetak\": \"" + document.getElementById("pocetak").value + "\", \"kraj\": \"" + document.getElementById("kraj").value + "\", \"naziv\": \"" + document.getElementsByClassName("sveSale")[0].value + "\", \"predavac\": \"" + document.getElementsByClassName("sveOsobe")[0].value + "\"}";
						Pozivi.dodajZauzeceJSON(string);
					}
					else{
						let string = "{\"datum\": \"" + dan.querySelectorAll("tr>td")[0].innerText + "." + mjesecZaUpis + "." + "2020" + "\", \"pocetak\": \"" + document.getElementById("pocetak").value + "\", \"kraj\": \"" + document.getElementById("kraj").value + "\", \"naziv\": \"" + document.getElementsByClassName("sveSale")[0].value + "\", \"predavac\": \"" + document.getElementsByClassName("sveOsobe")[0].value + "\"}";
						Pozivi.dodajZauzeceJSON(string);
					}
				}
			}
			else{
				//pritisnuli smo cancel...
				//ne radi nista
				//console.log(document.getElementsByClassName("kalendar")[0].querySelectorAll("table>tr>td").innerText);
			}
		}));
	}
}