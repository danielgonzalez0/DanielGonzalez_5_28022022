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

//===================================================================================

// gestion du bouton supprimer un article du panier

//===================================================================================

//selection des boutons supprimer du panier
let boutonSupprimer = document.querySelectorAll('.deleteItem');
console.log(boutonSupprimer);

//boucle pour parcourir tous les boutons et mettre en place eventListener
for (let i = 0; i < boutonSupprimer.length; i++) {
  boutonSupprimer[i].addEventListener('click', (event) => {
    event.preventDefault();

    //step1 récupérer ID et couleur
    let sectionASupprimer = boutonSupprimer[i].closest('.cart__item');
    let couleurProduitASupprimer = sectionASupprimer.getAttribute('data-color');
    let idProduitASupprimer = sectionASupprimer.getAttribute('data-id');
    //step2 définir clé storage a supprimer
    let keyLocaleStorageAsupprimer = `${idProduitASupprimer}//${couleurProduitASupprimer}`;
    //step 3 Demander à l'utilisateur de confirmer la suppression de l'article
    let articleASupprimer = JSON.parse(
      localStorage.getItem(keyLocaleStorageAsupprimer)
    );
    let questionUtilisateur = confirm(
      `Voulez-vous supprimer l'article ${articleASupprimer[4]} du panier ?`
    );
    if (questionUtilisateur) {
      //step 4 Supprimer l'article du local storage
      localStorage.removeItem(keyLocaleStorageAsupprimer);
      //step 5recharger la page pour mettre à jour panier et totaux
      window.location.href = 'cart.html';
    } //end if confirmation suppression

    console.log('=======test article a supprimer ===========');
    console.log(idProduitASupprimer);
    console.log(keyLocaleStorageAsupprimer);
    console.log(articleASupprimer);
    console.log('=======test article a supprimer ===========');
  }); // end fct callback du listener
} //end boucle for
