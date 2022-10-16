let i = 1;
let listaStarihSlika = new Array();

document.getElementsByClassName("sadrzaj")[0].innerHTML = "<div class=\"grid\"><img src=\"\" class =\"slika\" alt=\"etf1\"><img src=\"\" class =\"slika\" alt=\"etf2\"><img src=\"\" class =\"slika\" alt=\"etf3\"></div><button class=\"dugme dPret\" onclick=\"prethodni()\">Prethodni</button><button class=\"dugme dSljed\" onclick=\"sljedeci()\">Sljedeći</button>";

Pozivi.ucitajSlike(i);

function sljedeci(){
	if(i + 1 >= 5) document.getElementsByClassName("dSljed")[0].disabled = true;
	else Pozivi.ucitajSlike(++i);
}

function prethodni(){
	if(i - 1 <= 0) document.getElementsByClassName("dPret")[0].disabled = true;
	//else Pozivi.ucitajSlike(--i);
	else{
		i--;
		if(i == 1 || i == 2 || i == 3) {
        	document.getElementsByClassName("sadrzaj")[0].innerHTML = "<div class=\"grid\"><img src=\"" + listaStarihSlika[i * 3 - 3] + "\" class =\"slika\" alt=\"etf1\"><img src=\"" + listaStarihSlika[i * 3 - 2] + "\" class =\"slika\" alt=\"etf2\"><img src=\" " + listaStarihSlika[i * 3 - 1] + " \" class =\"slika\" alt=\"etf3\"></div><button class=\"dugme dPret\" onclick=\"prethodni()\">Prethodni</button><button class=\"dugme dSljed\" onclick=\"sljedeci()\">Sljedeći</button>";
            listaStarihSlika.splice(i * 3, listaStarihSlika.length);
        }
        else {
            document.getElementsByClassName("sadrzaj")[0].innerHTML = "<div class=\"grid\"><img src=\"" + listaStarihSlika[i * 3 - 3] + "\" class =\"slika\" alt=\"etf1\"></div><button class=\"dugme dPret\" onclick=\"prethodni()\">Prethodni</button><button class=\"dugme dSljed\" onclick=\"sljedeci()\">Sljedeći</button>";
            listaStarihSlika.splice(i * 3, listaStarihSlika.length);
        }
	}
}