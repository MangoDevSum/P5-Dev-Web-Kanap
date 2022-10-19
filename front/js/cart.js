async function main() {
  const panier = obtenir_panier();
  await remplir_html_panier(panier);
}

// Raccourci pratique.
function $(s) {
  return document.querySelector(s);
}

function obtenir_panier() {
/*
  let panier_actuel;
    // Est-ce que le panier existe déjà ?
    if (localStorage.panier != undefined) { // Si oui,
        // on le récupère en le "dé-stringifiant"
        panier_actuel = JSON.parse(localStorage.panier);
    } else { // sinon,
        // on se fait un tout nouveau panier vide ({} == objet vide).
        panier_actuel = [];
      // panier_actuel = new Object(); // alternative
    }
  return panier_actuel;
 */
  return JSON.parse(localStorage.panier ?? "[]");
}

async function recuperer_produit(id_produit) {
    const response = await fetch(`http://localhost:3000/api/products/${id_produit}`);
    const donnees = await response.json();
    return donnees;
}

async function remplir_html_panier(panier) {
  // let total_articles = 0;
  // let prix_total = 0;
  // const elements_panier = []
  for (const { id_produit, couleur, quantite } of panier) {
    console.log("id_produit:", id_produit);
    console.log("couleur:", couleur);
    console.log("quantité:", quantite);
    const produit = await recuperer_produit(id_produit);
    console.log("produit:", produit);
    const article = fabriquer_article(produit, couleur, quantite);
    // TODO: faire ça "proprement": remplacer strings et innerHTML par createElement et append.
    $("#cart__items").innerHTML += article;
  }
}

/* <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
  <div class="cart__item__img">
    <img src="../images/product01.jpg" alt="Photographie d'un canapé">
  </div>
  <div class="cart__item__content">
    <div class="cart__item__content__description">
      <h2>Nom du produit</h2>
      <p>Vert</p>
      <p>42,00 €</p>
    </div>
    <div class="cart__item__content__settings">
      <div class="cart__item__content__settings__quantity">
        <p>Qté : </p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
      </div>
    </div>
  </div>
</article> */
function fabriquer_article(produit, couleur, quantite) {
  const prix_en_euros = Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(produit.price);
  // TODO: faire ça "proprement": remplacer strings et innerHTML par createElement et append.
  return `<article class="cart__item" data-id="${produit._id}" data-color="${couleur}">
    <div class="cart__item__img">
      <img src="${produit.imageUrl}" alt="${produit.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${produit.name}</h2>
        <p>${couleur}</p>
        <p>${prix_en_euros}</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantite}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`;
}

document.addEventListener("DOMContentLoaded", async () => {
  await main();
}, false);
