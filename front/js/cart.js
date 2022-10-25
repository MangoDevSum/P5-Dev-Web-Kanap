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
  for (const { id_produit, couleur, quantite } of panier) {
    console.log("id_produit:", id_produit);
    console.log("couleur:", couleur);
    console.log("quantité:", quantite);
    const produit = await recuperer_produit(id_produit);
    console.log("produit:", produit);
    const article = fabriquer_article(produit, couleur, quantite);
    $("#cart__items").append(article);
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
  const prix_en_euros =
    Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
      .format(produit.price)
  ;
  const article = document.createElement("article");
    article.setAttribute("class", "cart__item");
    article.setAttribute("data-id", produit._id);
    article.setAttribute("data-color", couleur);
      const div1 = document.createElement("div");
      div1.setAttribute("class", "cart__item__img");
        const img = document.createElement("img");
        img.setAttribute("src", produit.imageUrl);
        img.setAttribute("alt", produit.altTxt);
      div1.append(img);
    article.append(div1);
      const div2 = document.createElement("div");
      div2.setAttribute("class", "cart__item__content");
        const div3 = document.createElement("div");
        div3.setAttribute("class", "cart__item__content__description");
          const h2 = document.createElement("h2");
          h2.append(produit.name);
        div3.append(h2);
          const p1 = document.createElement("p");
          p1.append(couleur);
        div3.append(p1);
          const p2 = document.createElement("p");
          p2.append(prix_en_euros);
        div3.append(p2);
      div2.append(div3);
        const div4 = document.createElement("div");
        div4.setAttribute("class", "cart__item__content__settings");
      div2.append(div4);
          const div5 = document.createElement("div");
          div5.setAttribute("class", "cart__item__content__settings__quantity");
        div4.append(div5);
            const p3 = document.createElement("p");
            p3.append("Qté : ");
          div5.append(p3);
            const input = document.createElement("input");
            input.setAttribute("type", "number");
            input.setAttribute("class", "itemQuantity");
            input.setAttribute("name", "itemQuantity");
            input.setAttribute("min", "1");
            input.setAttribute("max", "100");
            input.setAttribute("value", quantite);
          div5.append(input);
          const div6 = document.createElement("div");
          div6.setAttribute("class", "cart__item__content__settings__delete");
        div4.append(div6);
            const p4 = document.createElement("p");
            p4.setAttribute("class", "deleteItem");
            p4.append("Supprimer");
          div6.append(p4);
    article.append(div2);
  return article;
}

document.addEventListener("DOMContentLoaded", async () => {
  await main();
}, false);
