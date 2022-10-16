let danas = new Date();
let trenutniMjesec = danas.getMonth();

let Kalendar = (function(){ 
//ovdje idu privatni atributi
let periodicnaSala = new Array();
let vanrednaSala = new Array();

let brojMjeseca = 1;
let mjeseci = ["Januar", "Februar", "Mart", "April", "Maj", "Juni", "Juli", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"];
let dani = ["PON", "UTO", "SRI", "CET", "PET", "SUB", "NED"];

function obojiZauzecaImpl(kalendarRef, mjesec, sala, pocetak, kraj){
//implementacija ide ovdje
	let moze = 0;
	let moze2 = 0;
	let firstDay = (new Date(2019, mjesec)).getDay();
	//pocetak i kraj moraju biti uneseni
	if(pocetak.length != 0 && kraj.length != 0){
		//slucaj za periodicna zauzeca
		for(let i = 0; i < periodicnaSala.length; i++){
			moze = 0;
			//trazi se unesena sala
			if(periodicnaSala[i].naziv == sala){
				//uslovi za preklapanje vremena
				if((periodicnaSala[i].pocetak >= pocetak && kraj <= periodicnaSala[i].pocetak)||(kraj >= periodicnaSala[i].kraj && pocetak >= periodicnaSala[i].kraj)||(pocetak >= periodicnaSala[i].kraj && kraj <= periodicnaSala[i].pocetak)){
					moze = 1;
				}
				else if((periodicnaSala[i].pocetak > pocetak && kraj > periodicnaSala[i].pocetak)||(kraj > periodicnaSala[i].kraj && pocetak < periodicnaSala[i].kraj)){
					moze = 0;
				}
				if(moze == 0){
					//slucaj za zimski zemestar
					if(periodicnaSala[i].semestar == "zimski"){
						if(document.querySelector(".tekst").innerText == "Oktobar" || document.querySelector(".tekst").innerText == "Novembar" || document.querySelector(".tekst").innerText == "Decembar" || document.querySelector(".tekst").innerText == "Januar"){
							for(let j = periodicnaSala[i].dan + 7; j < document.querySelectorAll("body>div>div>table>tr>td").length; j += 7){
								//posto firstDay pocinje sa 0
								if(firstDay - 1 < 0){
				        			firstDay += 7;
				        		}
								if(j >= firstDay - 1 + 7){
									//bojenje sedmica
									document.querySelectorAll("body>div>div>table>tr>td")[j].getElementsByTagName("td")[1].className = "zauzeta";
								}
							}
						}
					}
					//slucaj za ljetni semestar
					else if(periodicnaSala[i].semestar == "ljetni"){
						if(document.querySelector(".tekst").innerText == "Februar" || document.querySelector(".tekst").innerText == "Mart" || document.querySelector(".tekst").innerText == "April" || document.querySelector(".tekst").innerText == "Maj" || document.querySelector(".tekst").innerText == "Juni"){
							for(let j = periodicnaSala[i].dan + 7; j < document.querySelectorAll("body>div>div>table>tr>td").length; j += 7){
								//posto firstDay pocinje sa 0
								if(firstDay - 1 < 0){
				        			firstDay += 7;
				        		}
								if(j >= firstDay - 1 + 7){
									//bojenje sedmica
									document.querySelectorAll("body>div>div>table>tr>td")[j].getElementsByTagName("td")[1].className = "zauzeta";
								}
							}
						}
					}
				}
			}
		}
		//slucaj za periodicna zauzeca
		for(let i = 0; i < vanrednaSala.length; i++){
			moze2 = 0;
			//trazi se unesena sala
			if(vanrednaSala[i].naziv == sala){
				//parsiranje datuma
				let danVanredne = vanrednaSala[i].datum.substr(0,2);
				let mjesecVanredne2 = vanrednaSala[i].datum.substr(3,2);
				let mjesecVanredne = parseInt(mjesecVanredne2);
				//uslovi za preklapanje vremena
				if((vanrednaSala[i].pocetak >= pocetak && kraj <= vanrednaSala[i].pocetak)||(kraj >= vanrednaSala[i].kraj && pocetak >= vanrednaSala[i].kraj)||(pocetak >= vanrednaSala[i].kraj && kraj <= vanrednaSala[i].pocetak)){
					moze2 = 1;
				}
				else if((vanrednaSala[i].pocetak > pocetak && kraj > vanrednaSala[i].pocetak)||(kraj > vanrednaSala[i].kraj && pocetak < vanrednaSala[i].kraj)){
					moze2 = 0; 
				}
				if(moze2 == 0){
					//trazi se mjesec po nazivu
					if(document.querySelector(".tekst").innerText == mjeseci[mjesecVanredne - 1]){
						//posto firstDay pocinje sa 0
						if(firstDay - 1 < 0){
						    firstDay += 7;
						}
						for(let j = firstDay - 1 + 7; j < document.querySelectorAll("body>div>div>table>tr>td").length; j++){
							if(j >= firstDay - 1 + 7){
								//bojenje dana
								let nesto = document.querySelectorAll("body>div>div>table>tr>td")[j].getElementsByTagName("td");
								if(parseInt(nesto[0].innerText) == parseInt(danVanredne)) nesto[1].className = "zauzeta";
							}
						}
					}
				}
			}
		}
	}
}

function ucitajPodatkeImpl(periodicna, vanredna){ 
//implementacija ide ovdje
	periodicnaSala = new Array();
	vanrednaSala = new Array();
	let validnaPeriodicna = 1;
	let validnaVanredna = 1;
	//validacija podataka
	for(let i = 0; i < periodicna.length; i++){
		validnaPeriodicna = 1;
		if(periodicna[i].dan > 6 || periodicna[i].dan < 0) validnaPeriodicna = 0;
		if(periodicna[i].semestar != "zimski" && periodicna[i].semestar != "ljetni") validnaPeriodicna = 0;
		//if(periodicna[i].pocetak.length != 5 || periodicna[i].kraj.length != 5) validnaPeriodicna = 0;
		if(periodicna[i].pocetak.substr(0,2).length != 2 || periodicna[i].kraj.substr(0,2).length != 2) validnaPeriodicna = 0;
		if(periodicna[i].pocetak.substr(0,2) < 0 || periodicna[i].pocetak.substr(0,2) > 23 || periodicna[i].kraj.substr(0,2) < 0 || periodicna[i].kraj.substr(0,2) > 23) validnaPeriodicna = 0;
		if(periodicna[i].pocetak.substr(2,1) != ":") validnaPeriodicna = 0;
		if(periodicna[i].pocetak.substr(3,2) < 0 || periodicna[i].pocetak.substr(3,2) > 59 || periodicna[i].kraj.substr(3,2) < 0 || periodicna[i].kraj.substr(3,2) > 59) validnaPeriodicna = 0;
		//dodavanje
		if(validnaPeriodicna == 1) periodicnaSala.push(periodicna[i]);
	}
	for(let i = 0; i < vanredna.length; i++){
		validnaVanredna = 1
		if(vanredna[i].datum.length != 10) validnaVanredna = 0;
		if(vanredna[i].datum.substr(0,2) > 31 || vanredna[i].datum.substr(0,2) < 0) validnaVanredna = 0;
		if(vanredna[i].datum.substr(3,2) > 12 || vanredna[i].datum.substr(3,2) < 0) validnaVanredna = 0;
		//if(vanredna[i].pocetak.length != 5 || vanredna[i].kraj.length != 5) validnaVanredna = 0;
		if(vanredna[i].pocetak.substr(0,2).length != 2 || vanredna[i].kraj.substr(0,2).length != 2) validnaVanredna = 0;
		if(vanredna[i].pocetak.substr(0,2) < 0 || vanredna[i].pocetak.substr(0,2) > 23 || vanredna[i].kraj.substr(0,2) < 0 || vanredna[i].kraj.substr(0,2) > 23) validnaVanredna = 0;
		if(vanredna[i].pocetak.substr(2,1) != ":") validnaVanredna = 0;
		if(vanredna[i].pocetak.substr(3,2) < 0 || vanredna[i].pocetak.substr(3,2) > 59 || vanredna[i].kraj.substr(3,2) < 0 || vanredna[i].kraj.substr(3,2) > 59) validnaVanredna = 0;
		//dodavanje
		if(validnaVanredna == 1) vanrednaSala.push(vanredna[i]);
	}
}

function iscrtajKalendarImpl(kalendarRef, mjesec){
//implementacija ide ovdje
	brojMjeseca = 1;
	//kalendarRef.innerHTML = "";
	let firstDay = (new Date(2019, mjesec)).getDay();
	//crta se prvo paragraf sa nazivom mjeseca
	var paragraf = document.createElement("p");
	var nazivMjeseca = document.createTextNode(mjeseci[mjesec]);
	paragraf.className = "tekst";
	paragraf.appendChild(nazivMjeseca);
	kalendarRef.appendChild(paragraf);
	let daysInMonth = 32 - new Date(2019, mjesec, 32).getDate();
	let tabela = document.createElement("table");
	tabela.className = "vanjskaTabela";
	for (let i = 0; i < 7; i++) {
	    let red = document.createElement("tr");
	    //crtanje dana u sedmici
	    if(i == 0){
	    	red.className="dan";
	        for(let j = 0; j < 7; j++){
	        	let dan = document.createElement("td");
	               let tekstDana = document.createTextNode(dani[j]);
	               dan.appendChild(tekstDana);
	               red.appendChild(dan);
	        }
	    }
	    //crtanje prvog reda
	    else if(i == 1){
	        for(let j = 0; j < 7; j++){
	        	if(firstDay - 1 < 0){
	        		firstDay += 7;
	        	}
	        	if(j < firstDay - 1){
	        		let cell = document.createElement("td");
	        		cell.id = "nemaBordera";
	                let cellText = document.createTextNode("");
	                cell.appendChild(cellText);
	                red.appendChild(cell);
	            }
	            else{
	            	let cell = document.createElement("td");
	            	cell.className = "unutrasnjaTabela";
	                //let cellText = document.createTextNode("AMILA");
	                //cell.appendChild(cellText);
	                for(let k = 0; k < 2; k++){
	                	let unutrasnjiRed = document.createElement("tr");
	                	if(k == 0){
	                		let dan = document.createElement("td");
	                		let tekstDana = document.createTextNode(brojMjeseca);
	                		brojMjeseca++;
	                		dan.appendChild(tekstDana);
	                		unutrasnjiRed.appendChild(dan);
	                	}
	                	else{
	                		let dan = document.createElement("td");
	                		dan.className="slobodna";
	                		unutrasnjiRed.appendChild(dan);
	                	}	
	                	cell.appendChild(unutrasnjiRed);
	                }
	                red.appendChild(cell);
	            }
	        }
	       }
	       //crtanje zadnjeg reda za sve osim Septembra i Decembra
	       else if(i == 5){
	        if(brojMjeseca == daysInMonth) break;
	        else{
	        	for(let j = 0; j < 7; j++){
	        	if(brojMjeseca == daysInMonth + 1) break;
	        	let dan = document.createElement("td");
	        	dan.className = "unutrasnjaTabela";
	               //let tekstDana = document.createTextNode(dani[j]);
	               //dan.appendChild(tekstDana);
	               for(let k = 0; k < 2; k++){
	                	let unutrasnjiRed = document.createElement("tr");
	                	if(k == 0){
	                		let dan = document.createElement("td");
	                		let tekstDana = document.createTextNode(brojMjeseca);
	                		brojMjeseca++;
	                		dan.appendChild(tekstDana);
	                		unutrasnjiRed.appendChild(dan);
	                	}
	                	else{
	                		let dan = document.createElement("td");
	                		dan.className="slobodna";
	                		unutrasnjiRed.appendChild(dan);
	                	}	
	                	dan.appendChild(unutrasnjiRed);
	                }
	               red.appendChild(dan);
	        	}
	        }
	       }
	       //Septembar i Decembar imaju 7 redova
	       else if(i == 6){
	       if(brojMjeseca >= 32) break;
	       else{
		       	for(let j = 0; j < 7; j++){
		        	if(brojMjeseca == daysInMonth + 1) break;
		        	let dan = document.createElement("td");
		        	dan.className = "unutrasnjaTabela";
		               //let tekstDana = document.createTextNode(dani[j]);
		               //dan.appendChild(tekstDana);
		               for(let k = 0; k < 2; k++){
		                	let unutrasnjiRed = document.createElement("tr");
		                	if(k == 0){
		                		let dan = document.createElement("td");
		                		let tekstDana = document.createTextNode(brojMjeseca);
		                		brojMjeseca++;
		                		dan.appendChild(tekstDana);
		                		unutrasnjiRed.appendChild(dan);
		                	}
		                	else{
		                		let dan = document.createElement("td");
		                		dan.className="slobodna";
		                		unutrasnjiRed.appendChild(dan);
		                	}	
		                	dan.appendChild(unutrasnjiRed);
		                }
		               red.appendChild(dan);
		        	}
		        }
	       }
	       //crtanje izmedju dana...
	       else{
	        for(let j = 0; j < 7; j++){
	        	let dan = document.createElement("td");
	        	dan.className = "unutrasnjaTabela";
	               //let tekstDana = document.createTextNode(dani[j]);
	               //dan.appendChild(tekstDana);
	               for(let k = 0; k < 2; k++){
	                	let unutrasnjiRed = document.createElement("tr");
	                	if(k == 0){
	                		let dan = document.createElement("td");
	                		let tekstDana = document.createTextNode(brojMjeseca);
	                		brojMjeseca++;
	                		dan.appendChild(tekstDana);
	                		unutrasnjiRed.appendChild(dan);
	                	}
	                	else{
	                		let dan = document.createElement("td");
	                		dan.className="slobodna";
	                		unutrasnjiRed.appendChild(dan);
	                	}	
	                	dan.appendChild(unutrasnjiRed);
	                }
	               red.appendChild(dan);
	        }
	       }
	       tabela.appendChild(red);
	       kalendarRef.appendChild(tabela); 
	   }
}
return {
	obojiZauzeca: obojiZauzecaImpl, 
	ucitajPodatke: ucitajPodatkeImpl, 
	iscrtajKalendar: iscrtajKalendarImpl
}
})();

//hardkodirani podaci
/*Kalendar.ucitajPodatke([{
	dan: 5,
	semestar: "zimski",
	pocetak: "12:00", 
	kraj: "15:00", 
	naziv: "0-02", 
	predavac: "predavac1"
}, {
	dan: 3,
	semestar: "ljetni",
	pocetak: "09:00", 
	kraj: "12:00", 
	naziv: "MA", 
	predavac: "predavac2"
}, {
	dan: 1,
	semestar: "ljetni",
	pocetak: "15:00", 
	kraj: "17:00", 
	naziv: "1-05", 
	predavac: "predavac3"
}, {
	dan: 4,
	semestar: "zimski",
	pocetak: "13:00", 
	kraj: "14:00", 
	naziv: "0-07", 
	predavac: "predavac4"
}, {
	dan: 0,
	semestar: "zimski",
	pocetak: "13:00", 
	kraj: "14:00", 
	naziv: "0-07", 
	predavac: "predavac5"
}, {
	dan: 2,
	semestar: "ljetni",
	pocetak: "14:00", 
	kraj: "16:00", 
	naziv: "VA2", 
	predavac: "predavac6"
}, {
	dan: 5,
	semestar: "zimski",
	pocetak: "12:00", 
	kraj: "16:00", 
	naziv: "1-09", 
	predavac: "predavac7"
}, {
	dan: 2,
	semestar: "zimski",
	pocetak: "13:00", 
	kraj: "16:00", 
	naziv: "VA1", 
	predavac: "predavac8"
}, {
	dan: 0,
	semestar: "ljetni",
	pocetak: "11:00", 
	kraj: "12:00", 
	naziv: "0-03", 
	predavac: "predavac9"
}],[{
	datum: "18.06.2019",
	pocetak: "12:00",
	kraj: "15:00",
	naziv: "0-02",
	predavac: "predavac10"
}, {
	datum: "05.12.2019",
	pocetak: "17:00",
	kraj: "19:00",
	naziv: "EE2",
	predavac: "predavac11"
}, {
	datum: "12.12.2019",
	pocetak: "17:00",
	kraj: "19:00",
	naziv: "EE2",
	predavac: "predavac12"
}, {
	datum: "08.04.2019",
	pocetak: "11:00",
	kraj: "13:00",
	naziv: "1-07",
	predavac: "predavac13"
}, {
	datum: "22.02.2019",
	pocetak: "10:00",
	kraj: "12:00",
	naziv: "EE1",
	predavac: "predavac14"
}]);*/

/*document.getElementsByClassName("kalendar")[0].innerHTML = "";
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
}*/

function sljedeci(){
	document.getElementsByClassName("dPret")[0].disabled = false; //za rubne slucajeve
	let kalendar = document.getElementsByClassName("kalendar")[0];
	kalendar.className="kalendar";
	if((trenutniMjesec + 1) < 12 && (trenutniMjesec + 1) >= 0) {
		document.getElementsByClassName("dSljed")[0].disabled = false;
		kalendar.innerHTML = "";
		Kalendar.iscrtajKalendar(kalendar, ++trenutniMjesec);
		onPromjena();
	}
	else{
		document.getElementsByClassName("dSljed")[0].disabled = true;
		document.getElementsByClassName("dPret")[0].disabled = false;
	}
}
function prethodni(){
	document.getElementsByClassName("dSljed")[0].disabled = false;
	let kalendar = document.getElementsByClassName("kalendar")[0];
	kalendar.className="kalendar";
	if((trenutniMjesec - 1) < 12 && (trenutniMjesec - 1) >= 0) {
		document.getElementsByClassName("dPret")[0].disabled = false;
		kalendar.innerHTML = "";
		Kalendar.iscrtajKalendar(kalendar, --trenutniMjesec);
		onPromjena();
	}
	else{
		document.getElementsByClassName("dPret")[0].disabled = true;
		document.getElementsByClassName("dSljed")[0].disabled = false;
	}
}