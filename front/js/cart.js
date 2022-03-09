//===================================================================================

// Afficher un tableau récapitulatif das achats

//===================================================================================

//déclaration des variables

let positionAffichageAchat = document.getElementById('cart__items');
let listeDesAchats = '';

//boucle pour récupérer les achats dans le localStorage et créer le tableau récap

for (let i = 0; i < localStorage.length; i++) {
  console.log(localStorage.getItem(localStorage.key(i)));

  // récupérer et convertir en JS l'achat stocké dans le local storage (clé + valeurs)
  let achatRecupere = localStorage.getItem(localStorage.key(i));
  let achatFormate = JSON.parse(achatRecupere);
  console.log(achatFormate);

  //Ajuster le prix en fonction des quantités
  let achatQuantite = parseInt(achatFormate[2]);
  let achatPrix = parseInt(achatFormate[3]);
  let achatTotal = achatQuantite * achatPrix; // a retirer

  // créer le récapitulatif de l'achat dans le panier
  listeDesAchats = ` <article
                class="cart__item"
                data-id=${achatFormate[0]}
                data-color=${achatFormate[1]}
              >
                <div class="cart__item__img">
                  <img
                    src=${achatFormate[5]}
                    alt="${achatFormate[6]}"
                  />
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${achatFormate[4]}</h2>
                    <p>${achatFormate[1]}</p>
                    <p>${achatPrix.toLocaleString()},00 €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté :</p>
                      <input
                        type="number"
                        class="itemQuantity"
                        name="itemQuantity"
                        min="1"
                        max="100"
                        value=${achatFormate[2]}
                      />
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;
  positionAffichageAchat.insertAdjacentHTML('beforeend', listeDesAchats);
} //end boucle for

//===================================================================================

// Calculer quantité et prix total

//===================================================================================

//declaration des variables
let quantiteSelection = document.querySelectorAll('.itemQuantity');
let positionQuantiteTotale = document.getElementById('totalQuantity');
let quantiteTotale = '';

/*let prixSelection = document.querySelectorAll(
  '.cart__item__content__description'
);*/

let prixSelection = document.querySelectorAll('.cart__item__content');

let poistionPrixTotal = document.getElementById('totalPrice');
let prixTotal = '';

//fonction calcul quantité
const calculQuantite = () => {
  let quantiteTotale = 0;
  for (let quantite of quantiteSelection) {
    quantiteTotale = quantiteTotale + parseInt(quantite.value);
    console.log(quantiteTotale);
  } //end boucle
  return quantiteTotale;
}; //end fonction

//fonction calcul prix

const calculPrix = () => {
  let prixTotal = 0;
  for (let i = 0; i < prixSelection.length; i++) {
    //selection de l'élément ou se trouve le prix unitaire
    let prixFormatTexte = prixSelection[i].querySelector(
      '.cart__item__content__description'
    ).lastElementChild.textContent;
    //conversion string => number
    prixFormatTexte = prixFormatTexte.replaceAll('\u202F', '');
    let prixFormatNombre = parseInt(prixFormatTexte);
    console.log(prixFormatNombre);
    //selection de l'élément ou se trouve la quantité
    let quantiteProduit = prixSelection[i].querySelector('.itemQuantity').value;
    //calcul Prix du produit
    let prixProduit = quantiteProduit * prixFormatNombre;
    //calcul prix total
    prixTotal = prixTotal + prixProduit;
  } //end boucle
  return prixTotal;
}; //end fonction

// appel des fonctions pour afficher quantité et prix
console.log(quantiteTotale);
console.log(prixTotal);
positionQuantiteTotale.innerText = calculQuantite();
poistionPrixTotal.innerText = calculPrix();
