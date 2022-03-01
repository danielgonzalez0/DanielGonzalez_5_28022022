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
// utilisation de fetch méthode get en mettant l'id en paramètre
fetch(`http://localhost:3000/api/products/${productId}`)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  }) // fin promise .then

  //promise pour ajouter les fiches pdts dans la page d'acceuil
  .then(function (array) {
    console.log(array);
  }) // fin promise .then

  // gestion des erreurs sur chargment data via API
  .catch(function (error) {
    alert(`l'erreur suivante est survenue:
     ${error}`);
  }); // fin fct fetch
