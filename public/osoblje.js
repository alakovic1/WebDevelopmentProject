Pozivi.ucitajOsobljeISale();
setInterval(function(){
	Pozivi.ucitajOsobljeISale();
},30000);

function popuniTabelu(json){
	var sadrzaj = document.getElementsByClassName("sadrzaj")[0];
	sadrzaj.innerHTML = "<br><br><br>";
	var tabela = document.createElement("table");
	tabela.className = "tabelaOsoblje";
		var red = document.createElement("tr");
			var cell = document.createElement("th");
			var cellText = document.createTextNode("Sala");
			cell.appendChild(cellText);
			var cell2 = document.createElement("th");
			var cellText2 = document.createTextNode("Osoba");
			cell2.appendChild(cellText2);
		red.appendChild(cell2);
		red.appendChild(cell);
		tabela.appendChild(red);
		for(let i = 0; i < json.zauzeto.length; i++){
			var red2 = document.createElement("tr");
				var kolona = document.createElement("td");
				var tekst = document.createTextNode(json.zauzeto[i].osoba);
				kolona.appendChild(tekst);
				red2.appendChild(kolona);

				var kolona2 = document.createElement("td");
				var tekst2 = document.createTextNode(json.zauzeto[i].sala);
				kolona2.appendChild(tekst2);
				red2.appendChild(kolona2);
			tabela.appendChild(red2);
		}
	sadrzaj.appendChild(tabela);
}