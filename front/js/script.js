//Mise à jour de la fiche produit de la page d'accueil

//déclaration des variables

let itemElement = document.getElementById('items');

//récupérer les données du catalogue via l'API du backend

fetch('http://localhost:3000/api/products/')
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  }) // fin promise .then

  //promise pour ajouter les fiches pdts dans la page d'acceuil
  .then(function (array) {
    console.log(array);
    let listOfProducts = '';
    for (let prod in array) {
      listOfProducts += `<a href="./product.html?id=${array[prod]._id}">
            <article>
              <img
                src=${array[prod].imageUrl}
                alt="${array[prod].altTxt}"
              />
              <h3 class="productName">${array[prod].name}</h3>
              <p class="productDescription">${array[prod].description}</p>
            </article>
          </a>`;
      itemElement.innerHTML = listOfProducts;
    } // fin boucle for
  }) // fin promise .then

  // gestion des erreurs sur chargment data via API
  .catch(function (error) {
    alert(`l'erreur suivante est survenue:
     ${error}`);
  }); // fin fct fetch
