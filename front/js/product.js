//===================================================================================

// Mise à jour de la page produit à partir de l'ID récupéré dans l'URL

//====================================================================================

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
// méthode : utiliser le constructor new pour accéder à méthode get de l'api URLSearchParams
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
      listOfColors = `<option value=${arrayOfColors[color]}>${arrayOfColors[color]}</option>`;
      positionElementColors.insertAdjacentHTML('beforeend', listOfColors);
    } //fin boucle for
  }) // fin promise .then

  // gestion des erreurs sur chargement données via l'API
  .catch(function (error) {
    alert(`l'erreur suivante est survenue:
     ${error}`);
  }); // fin fct fetch

//===================================================================================

// création du panier

//====================================================================================

// Etape 1 récupérer les données selectionnées par l'utilisateur
// données: ID pdt, quantité pdt, couleur pdt

// récupération de l'ID => déjà fait variable productId
//récupération de la couleur

let selectOptionColor = document.querySelector('#colors');
let choixColor = '';
//console.log(selectOptionColor.options);
//console.log(defaultColor.innerText);

selectOptionColor.addEventListener('change', () => {
  choixColor = selectOptionColor.options[selectOptionColor.selectedIndex].value;
  console.log(choixColor);
  return choixColor;
}); // end eventListener

//récupération de la quantité
let selectQuantite = document.querySelector('#quantity');
let choixQuantite = 0;
selectQuantite.addEventListener('change', () => {
  try {
    if (selectQuantite.value <= 0 || selectQuantite.value > 100)
      throw 'la quantité choisie doit être comprise entre 1 et 100';

    choixQuantite = selectQuantite.value;
    console.log(choixQuantite);

    return choixQuantite;
  } catch (error) {
    alert(`L'erreur suivante est survenue: ${error}`);
  } // end try & catch
}); // end eventListener

// -------création d'une ligne panier au clic du bouton------------

let ajoutPanier = document.getElementById('addToCart');

ajoutPanier.addEventListener('click', () => {
  try {
    //mise en place des exceptions personnalisées

    if (choixColor == '')
      throw `La couleur sélectionnée n'a pas été prise dans le panier.
    Veuillez (re)sélectionner une couleur.`;

    if (choixQuantite == 0)
      throw `la quantité sélectionnée dans le panier est égale à 0.
    Veuiilez (re)sélectionner une quantité`;

    let produitNom = positionElementTitre.textContent;
    let produitPrix = positionElementPrix.textContent;
    let produitImageUrl = positionElementImg.firstChild.currentSrc;
    let produitAltDescription = positionElementImg.firstChild.alt;

    let lignePanier = new Array(
      productId,
      choixColor,
      choixQuantite,
      produitPrix,
      produitNom,
      produitImageUrl,
      produitAltDescription
    );
    lignePanier.name = `${productId}//${choixColor}`;
    console.log(lignePanier);

    //------------------------------------------------------------------

    // --------ajout de la ligne au local storage-----------------------

    //vérifier si ligne de panier déjà dans le local storage

    let ligneProduitsDansLocalStorage = JSON.parse(
      localStorage.getItem(lignePanier.name)
    ); //JSON.parse => converti les données JSON en données JS

    //si ligne déjà dans le local storage:

    //1) on modifie les quantités
    if (ligneProduitsDansLocalStorage) {
      let quantiteEnregistre = parseInt(ligneProduitsDansLocalStorage[2]);
      let quantiteModifie = quantiteEnregistre + parseInt(choixQuantite);
      console.log(quantiteModifie);

      //test quantité <= 100

      if (quantiteModifie > 100) {
        alert(
          `100 articles maximum du même produit sont autorisés dans le panier`
        );
      } else {
        let questionUtilisateur =
          confirm(`Vous avez déjà ${quantiteEnregistre} article(s) de ce produit dans votre panier.
    Voulez-vous ajouter ${choixQuantite} article(s)`);

        if (questionUtilisateur) {
          //2) on met à jour la ligne de panier avec nouvelle quantité
          lignePanier[2] = quantiteModifie;
          console.log(lignePanier);

          //3) on supprime la ligne du local storage
          localStorage.removeItem(lignePanier.name);

          //4) on crée la nouvelle ligne dans le local storage

          localStorage.setItem(lignePanier.name, JSON.stringify(lignePanier));
          console.log(ligneProduitsDansLocalStorage);
          alert('Article(s) ajouté(s) au panier');
        } //end if confirm
      } // end if test quantité

      //si la ligne n'est pas dans le local storage, on crée la ligne
    } else {
      localStorage.setItem(lignePanier.name, JSON.stringify(lignePanier));
      console.log(ligneProduitsDansLocalStorage);
    } // end try
  } catch (error) {
    alert(`L'erreur suivante est survenue: ${error}`);
  } // end catch

  //------------------------------------------------------------------
}); // end eventlistener
