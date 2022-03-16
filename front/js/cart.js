//===================================================================================

// Afficher un tableau récapitulatif das achats

//===================================================================================

//déclaration des variables

let positionAffichageAchat = document.getElementById('cart__items');
let listeDesAchats = '';

//boucle pour récupérer les achats dans le localStorage et créer le tableau récap

for (let i = 0; i < localStorage.length; i++) {
  // console.log(localStorage.getItem(localStorage.key(i)));

  // récupérer et convertir en JS l'achat stocké dans le local storage (clé + valeurs)
  let achatRecupere = localStorage.getItem(localStorage.key(i));
  let achatFormate = JSON.parse(achatRecupere);
  //console.log(achatFormate);

  //Ajuster le prix en fonction des quantités
  let achatQuantite = parseInt(achatFormate[2]);
  let achatPrix = parseInt(achatFormate[3]);

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
    // console.log(quantiteTotale);
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
    //console.log(prixFormatNombre);
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
//console.log(quantiteTotale);
//console.log(prixTotal);
positionQuantiteTotale.innerText = calculQuantite();
poistionPrixTotal.innerText = calculPrix();

//===================================================================================

// gestion du bouton supprimer un article du panier

//===================================================================================

//selection des boutons supprimer du panier
let boutonSupprimer = document.querySelectorAll('.deleteItem');
//console.log(boutonSupprimer);

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

//===================================================================================

// gestion de la fonction modifier la quantité d'un article dans le panier

//===================================================================================

//selection des zones ou les quantités peuvent être modifiés
let zoneQuantiteAModifier = document.querySelectorAll('.itemQuantity');

//boucle pour parcourir tous les boutons et mettre en place eventListener
for (let i = 0; i < zoneQuantiteAModifier.length; i++) {
  let quantiteInitiale = parseInt(zoneQuantiteAModifier[i].value);
  zoneQuantiteAModifier[i].addEventListener('change', (event) => {
    event.preventDefault();
    event.target.focus(); // pour résoudre problème lié à firefox (input type number ne déclenche pas le focus quand on change la quantité)
  }); //end listener change

  zoneQuantiteAModifier[i].addEventListener('blur', (event) => {
    event.preventDefault();
    event.target.blur();
    let quantiteModifie = parseInt(zoneQuantiteAModifier[i].value);

    //step 1 test de la valeur saisie et gestion des exceptions
    try {
      if (quantiteModifie <= 0 || quantiteModifie > 100)
        throw 'la quantité saisie doit être comprise entre 1 et 100';

      if (isNaN(quantiteModifie))
        throw `la quantité doit être un nombre compris entre 1 et 100`;

      if (quantiteModifie !== quantiteInitiale) {
        //step 2 récupérer ID et couleur
        let sectionAModifier = zoneQuantiteAModifier[i].closest('.cart__item');
        let couleurProduitAModifier =
          sectionAModifier.getAttribute('data-color');
        let idProduitAModifier = sectionAModifier.getAttribute('data-id');
        //step 3 définir clé storage a modifier
        let keyLocaleStorageAModifier = `${idProduitAModifier}//${couleurProduitAModifier}`;

        //step 4 Demander à l'utilisateur de confirmer la modification de l'article
        let articleAModifier = JSON.parse(
          localStorage.getItem(keyLocaleStorageAModifier)
        );
        let questionUtilisateur = confirm(
          `Voulez-vous modifier la quantité d'article du produit ${articleAModifier[4]} ?
        
        La nouvelle quantité sera égale à ${quantiteModifie}.`
        );
        if (questionUtilisateur) {
          //step 5 Modifier la quantité dans le panier
          articleAModifier[2] = quantiteModifie;
          //step 6 Supprimer l'article du local storage
          localStorage.removeItem(keyLocaleStorageAModifier);
          //step 7 on crée la nouvelle ligne dans le local storage
          localStorage.setItem(
            keyLocaleStorageAModifier,
            JSON.stringify(articleAModifier)
          );
          //step 8 recharger la page pour mettre à jour panier et totaux
          window.location.href = 'cart.html';
        } //end if confirmation modification

        console.log('=====test modification quantité======');
        console.log(quantiteModifie);
        console.log(keyLocaleStorageAModifier);
        console.log(articleAModifier);
        console.log('=====test modification quantité======');
      } //end if
    } catch (error) {
      //event.target.blur();
      alert(`L'erreur suivante est survenue: 
      
      ${error}`);
      zoneQuantiteAModifier[i].value = quantiteInitiale;
    } // end try & catch
  }); //end event listener
} //end boucle for

//===================================================================================

// gestion validation des données du formulaire

//===================================================================================

//declararion variable
let formulaireCommande = document.querySelector('.cart__order__form');
let champsFormulaire = document.querySelectorAll('input[required]');
let valide = true;

//declaration fonction reset du message d'erreur
const resetMessageErreurValidation = (champ) => {
  champ.nextElementSibling.textContent = '';
  valide = true;
}; //end fonction

/*console.log('=====test formulaire======');
console.log(formulaireCommande);
console.log(champsFormulaire);
console.log('=====test formulaire======');*/

//declaration fonction validation prénom

const validationPrenom = () => {
  let champPrenom = document.getElementById('firstName');
  let regexPrenom = /^[A-Za-zA-ZÀ-ÿ -]{3,20}$/;
  let messageErreur = `Le Prénom doit commencer par une majuscule, contenir entre 3 et 20 caractères et ne doit pas contenir de chiffres ou de caractères spéciaux hors "-" et " ".`;
  let testPrenom = regexPrenom.test(champPrenom.value);
  /* console.log('=====test validation prenom=====');
  console.log('valeur dans champ prénom :' + champPrenom.value);
  console.log(regexPrenom);
  console.log('resultat test prenom: ' + testPrenom);
  console.log(messageErreur);
  console.log('valide = ' + valide);
  console.log('=====test validation prenom=====');*/
  if (testPrenom) {
    return true;
  } else {
    champPrenom.nextElementSibling.textContent = messageErreur;
    return false;
  } //end if
}; //end fonction prenom

//declaration fonction validation nom

const validationNom = () => {
  let champNom = document.getElementById('lastName');
  let regexNom = /^[A-Z][a-zA-ZÀ-ÿ -]{3,30}$/;
  let messageErreur = `Le Nom doit commencer par une majuscule, contenir entre 3 et 30 caractères et ne doit pas contenir de chiffres ou de caractères spéciaux hors "-" et " ".`;
  let testNom = regexNom.test(champNom.value);
  if (testNom) {
    return true;
  } else {
    champNom.nextElementSibling.textContent = messageErreur;
    return false;
  } //end if
}; //end fonction nom

//declaration fonction validation Adresse

const validationAdresse = () => {
  let champAdresse = document.getElementById('address');
  let regexAdresse =
    /^[a-zA-ZÀ-ÿ0-9 -',]{3,60}[^\[\](%#"@=}{}$£¤µ*§!:/;.?¨^|)]$/;
  let messageErreur = `L'adresse doit contenir entre 3 et 60 caractères et ne doit pas contenir de caractères spéciaux suivant : [](%#"@=}{}$£¤µ*§!:/;.?¨^|)`;
  let testAdresse = regexAdresse.test(champAdresse.value);
  if (testAdresse) {
    return true;
  } else {
    champAdresse.nextElementSibling.textContent = messageErreur;
    return false;
  } //end if
}; //end fonction adresse

//declaration fonction validation ville

const validationVille = () => {
  let champVille = document.getElementById('city');
  let regexVille = /^[A-Z]+[a-zA-ZÀ-ÿ -]{3,40}$/;
  let messageErreur = `La Ville doit commencer par une majuscule, contenir entre 3 et 30 caractères et ne doit pas contenir de chiffres ou de caractères spéciaux hors "-" et " ".`;
  let testVille = regexVille.test(champVille.value);
  if (testVille) {
    return true;
  } else {
    champVille.nextElementSibling.textContent = messageErreur;
    return false;
  } //end if
}; //end fonction ville

//declaration fonction test validité champ selon règle navigateur
const validationChamp = (champ) => {
  if (champ.checkValidity()) {
    return true;
  } else {
    champ.nextElementSibling.textContent = champ.validationMessage; // prop => message
    return false;
  } // end if
}; //end fonction

//mise en place ecoute validation de chaque champ du formulaire

//----------------------------------------------------------
//automatisation gestion par défaut des navigateurs
//----------------------------------------------------------

champsFormulaire.forEach((champ) => {
  champ.addEventListener('focus', () => {
    resetMessageErreurValidation(champ);
  }); // end event focus
  champ.addEventListener('blur', () => {
    switch (champ.name) {
      case 'firstName':
        validationPrenom();
        break;
      case 'lastName':
        validationNom();
        break;
      case 'address':
        validationAdresse();
        break;
      case 'city':
        validationVille();
        break;
      default:
        validationChamp(champ);
    } //end switch
  }); //end event blur
}); // end for each

//end event focus

formulaireCommande.addEventListener('submit', (event) => {
  event.preventDefault();

  // mise en place boucle pour vérifier validité de chaque champ

  champsFormulaire.forEach((champ) => {
    resetMessageErreurValidation(champ);
  }); // boucle for each

  champsFormulaire.forEach((champ) => {
    switch (champ.name) {
      case 'firstName':
        if (!validationPrenom()) {
          valide = false;
        } //end if
      case 'lastName':
        if (!validationNom()) {
          valide = false;
        } //end if
        break;
      case 'address':
        if (!validationAdresse()) {
          valide = false;
        } //end if
        break;
      case 'city':
        if (!validationVille()) {
          valide = false;
        } //end if
        break;
      default:
        if (!validationChamp(champ)) {
          valide = false;
          console.log("=====test validation d'un champ=====");
          console.log(champ.name);
          console.log('resultat valide : ' + valide);
          console.log("=====test validation d'un champ=====");
        }
      //end if
    } //end switch
  }); // boucle for each

  console.log('apres la boucle submit, valide = ' + valide);

  if (valide) {
    confirm('le formulaire est envoyé');

    //===================================================================================

    // gestion envoi de la commande

    //===================================================================================

    //----------------------------------------------------------
    //creation du tableau avec les ID des pdts commandés
    //----------------------------------------------------------

    let products = [];
    let selectionProduitsCommandes = document.querySelectorAll('.cart__item');
    selectionProduitsCommandes.forEach((produit) => {
      let produitId = produit.getAttribute('data-id');
      products.push(produitId);
    }); //end foreach

    //----------------------------------------------------------
    //creation de l'objet formulaire
    //----------------------------------------------------------

    let contact = new Object();
    contact.firstName = document.getElementById('firstName').value;
    contact.lastName = document.getElementById('lastName').value;
    contact.address = document.getElementById('address').value;
    contact.city = document.getElementById('city').value;
    contact.email = document.getElementById('email').value;

    let objetAEnvoyer = { products, contact };

    //----------------------------------------------------------
    //envoi de l'objet contact et du tableau products vers l'API
    //----------------------------------------------------------

    const envoi = fetch('http://localhost:3000/api/products/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(objetAEnvoyer),
    }); //end fetch

    //----------------------------------------------------------
    //affichage de la réponse de l'API dans la console
    // et récupération numéro de commande
    //----------------------------------------------------------

    envoi.then(
      async (response) => {
        try {
          const contenu = await response.json();
          const numeroDeCommande = contenu.orderId;
          window.location.href = `http://127.0.0.1:5500/front/html/confirmation.html?id=${numeroDeCommande}'`;

          console.log("-----réponse de l'Api--------");
          console.log(envoi);
          console.log(contenu);
          console.log(numeroDeCommande);
          console.log("-----réponse de l'Api--------");
        } catch (error) {
          //end try
          console.log(error);
        } //end catch
      } //end callback
    ); //end then

    console.log('-----test validation commande------');
    console.log(selectionProduitsCommandes);
    console.log(products);
    console.log(contact);
    console.log(objetAEnvoyer);
    console.log('-----test validation commande------');
  } //end if
}); //end eventlistener
