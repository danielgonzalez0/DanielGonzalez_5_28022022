//déclaration des variables de position des éléments du DOM
let positionElementImg = document.querySelector('.item__img');
let positionElementTitre = document.getElementById('title');
let positionElementPrix = document.getElementById('price');
let positionElementDescription = document.getElementById('description');
let positionElementColors = document.getElementById('colors');

//récupération de la chaîne de requête de l'URL pour avoir l'ID
let queryStringUrlId = window.location.search;
console.log(queryStringUrlId);

// extraction de l'ID
// méthode : utiliser un constructor new pour accéder mthode get
let urlSearchParamsId = new URLSearchParams(queryStringUrlId);
console.log(urlSearchParamsId);
let productId = urlSearchParamsId.get('id');
//get("name")=> se trouve dans l'url entre le ? et le = (?name=)
console.log(productId);

//affichage du produit rattaché à l'ID de l'url
// utilisation de fetch + méthode get en mettant l'id en paramètre
fetch(`http://localhost:3000/api/products/${productId}`)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  }) // fin promise .then

  //promise pour ajouter les données du produit
  .then(function (pdt) {
    console.log(pdt);
    positionElementImg.innerHTML = `<img src=${pdt.imageUrl} alt="${pdt.altTxt}" />`;
    positionElementTitre.innerText = pdt.name;
    positionElementPrix.innerText = pdt.price;
    positionElementDescription.innerText = pdt.description;
    //boucle for pour afficher les différents choix de couleurs
    console.log(pdt.colors);
    let arrayOfColors = pdt.colors;
    let listOfColors = '';
    for (let color in arrayOfColors) {
      listOfColors += `<option value=${arrayOfColors[color]}>${arrayOfColors[color]}</option>`;
      positionElementColors.innerHTML = listOfColors;
    } //fin boucle for
  }) // fin promise .then

  // gestion des erreurs sur chargement données via l'API
  .catch(function (error) {
    alert(`l'erreur suivante est survenue:
     ${error}`);
  }); // fin fct fetch
