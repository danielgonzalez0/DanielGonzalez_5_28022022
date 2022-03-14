//===================================================================================

// récupération du numero de commande dans l'URL et affichage du numéro de commande

//===================================================================================

//récupération de la chaîne de requête de l'URL pour avoir l'ID
let requeteUrlId = window.location.search;
console.log(requeteUrlId);

// extraction de l'ID
// méthode : utiliser le constructor new pour accéder à méthode get de l'api URLSearchParams
let urlSearchParamsId = new URLSearchParams(requeteUrlId);
console.log(urlSearchParamsId);
let commandeId = urlSearchParamsId.get('id');
let commandeIdMiseEnForme = commandeId.substring(0, commandeId.length - 1);
//get("name")=> se trouve dans l'url entre le ? et le = (?name=)
console.log(commandeId);
console.log(commandeId.length);
console.log(commandeIdMiseEnForme);

//insertion du numero de commande sur la page

let positionNumeroDeCommande = document.getElementById('orderId');
positionNumeroDeCommande.textContent = commandeIdMiseEnForme;
