//===================================================================================

// Afficher un tableau récapitulatif das achats

//===================================================================================

//déclaration des variables

let positionAffichageAchat = document.getElementById('cart__items');
let listeDesAchats = '';

//boucle pour récupérer les achats dans le localStorage et créer le tableau récap

for (let i = 0; i < localStorage.length; i++) {
  console.log(localStorage.getItem(localStorage.key(i)));

  // récupérer et convertir en JS l'achat stocké dans le local storage (clé + valeurs) et
  let achatRecupere = localStorage.getItem(localStorage.key(i));
  let achatFormate = JSON.parse(achatRecupere);
  console.log(achatFormate);

  //Ajuster le prix en fonction des quantités
  let achatQuantite = parseInt(achatFormate[2]);
  let achatPrix = parseInt(achatFormate[3]);
  let achatTotal = achatQuantite * achatPrix;

  // créer le récapitulatif de l'achat dans le panier
  listeDesAchats = ` <article
                class="cart__item"
                data-id=${achatFormate[0]}
                data-color=${achatFormate[1]}
              >
                <div class="cart__item__img">
                  <img
                    src=${achatFormate[5]}
                    alt="Photographie d'un canapé"
                  />
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${achatFormate[4]}</h2>
                    <p>${achatFormate[1]}</p>
                    <p>${achatTotal.toLocaleString()},00 €</p>
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
}
