async function main() {
  const panier = obtenir_local_storage_panier();
  await remplir_html_panier(panier);
  listeners_formulaire();
}

// Raccourci pratique.
function $(s) {
  return document.querySelector(s);
}

function obtenir_local_storage_panier() {
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

async function remplir_html_panier(panier /*: ElementPanier[] */) {
  let total_articles = 0;
  let prix_total = 0;
  const articles = [];
  for (const element/* : ElementPanier */ of panier) {
    const produit = await recuperer_produit(element.id_produit);

    const article = fabriquer_article(produit, element.couleur, element.quantite);
    articles.push(article);

    total_articles += element.quantite;
    prix_total += (produit.price * element.quantite);
  }
  $("#cart__items").replaceChildren(...articles);

  $("#totalQuantity").innerText = total_articles;
  const prix_virgule =
    Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      .format(prix_total)
  ;
  $("#totalPrice").innerText = prix_virgule;
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
            input.addEventListener("change", async (evenement) => {
              const nouvelle_qte = parseInt(evenement.target.value);
              await changer_qte_element_panier(couleur, produit._id, nouvelle_qte);
            })
          div5.append(input);
          const div6 = document.createElement("div");
          div6.setAttribute("class", "cart__item__content__settings__delete");
        div4.append(div6);
            const p4 = document.createElement("p");
            p4.setAttribute("class", "deleteItem");
            p4.append("Supprimer");
            p4.addEventListener(
              "click",
              // Fonction "inlinée" pour qu'elle ait accès aux
              // variables ci-présentes / "in scope" (par ex: couleur).
              async () => {
                await supprimer_element_panier(couleur, produit._id);
              },
            )
          div6.append(p4);
    article.append(div2);
  return article;
}

async function supprimer_element_panier(notre_couleur,notre_id_produit) {
  const panier/*: ElementPanier[] */ = obtenir_local_storage_panier();
  for (const i in panier) {
    if (panier[i].id_produit == notre_id_produit && panier[i].couleur == notre_couleur) {
      // delete panier[i]; /* panier[i] = null; */
      panier.splice(i, 1);
    }
  }
  localStorage.panier = JSON.stringify(panier);
  await remplir_html_panier(panier);
}

async function changer_qte_element_panier(notre_couleur, notre_id_produit, nouvelle_qte) {
  const panier/*: ElementPanier[] */ = obtenir_local_storage_panier();
  for (const element/*: ElementPanier */ of panier) {
    if (element.id_produit == notre_id_produit && element.couleur == notre_couleur) {
      element.quantite = nouvelle_qte;
    }
  }
  localStorage.panier = JSON.stringify(panier);
  await remplir_html_panier(panier);
}

function listeners_formulaire() {
  const formulaire = $(".cart__order__form");
  formulaire.addEventListener("submit", gerer_submit_formulaire);
}

async function gerer_submit_formulaire(evenement) {
  const infos_formulaire = lire_infos_formulaire();
  console.log(infos_formulaire);
  console.log(infos_formulaire.firstName);

  const regle_prenom_ou_nom = /^[^0-9]+$/;
  const regle_adresse_ou_ville = /^.+$/;
  const regle_email = /^[a-z0-9\._]+@[a-z]+\.[a-z]+$/i;

  const prenom_est_valide = regle_prenom_ou_nom.test(infos_formulaire.firstName);
  console.log("prenom_est_valide", prenom_est_valide);
  if (prenom_est_valide == false) {
    $("#firstNameErrorMsg").innerText = "Veuillez écrire un prénom valide";
  } else {
    $("#firstNameErrorMsg").innerText = "";
  }

  const nom_est_valide = regle_prenom_ou_nom.test(infos_formulaire.lastName);
  console.log("nom_est_valide", nom_est_valide);
  if (nom_est_valide == false) {
    $("#lastNameErrorMsg").innerText = "Veuillez écrire un nom valide";
  } else {
    $("#lastNameErrorMsg").innerText = "";
  }

  const adresse_est_valide = regle_adresse_ou_ville.test(infos_formulaire.address);
  console.log("adresse_est_valide", adresse_est_valide);
  if (adresse_est_valide == false) {
    $("#addressErrorMsg").innerText = "Veuillez fournir une adresse";
  } else {
    $("#addressErrorMsg").innerText = "";
  }

  const ville_est_valide = regle_adresse_ou_ville.test(infos_formulaire.city);
  console.log("ville_est_valide", ville_est_valide);
  if (ville_est_valide == false) {
    $("#cityErrorMsg").innerText = "Veuillez fournir une ville";
  } else {
    $("#cityErrorMsg").innerText = "";
  }

  const email_est_valide = regle_email.test(infos_formulaire.email);
  console.log("email_est_valide", email_est_valide);
  if (email_est_valide == false) {
    $("#emailErrorMsg").innerText = "Veuillez écrire une adresse email valide";
  } else {
    $("#emailErrorMsg").innerText = "";
  }

  if (true
    && prenom_est_valide
    && nom_est_valide
    && adresse_est_valide
    && ville_est_valide
    && email_est_valide
  )
  {
    // Tout est bon!
    const panier = obtenir_local_storage_panier();
    evenement.preventDefault();
    const donnees = await passer_commande(infos_formulaire, panier);
    console.log("donnees:", donnees.orderId);
    window.location = `./confirmation.html?commande=${donnees.orderId}`;

  } else {
    // Empêcher le submit de "go through" / s'effectuer.
    evenement.preventDefault();
  }
}

function lire_infos_formulaire() {
  const contact = {
    firstName: $("#firstName").value,
    lastName: $("#lastName").value,
    address: $("#address").value,
    city: $("#city").value,
    email: $("#email").value,
  };

  return contact;
}

async function json_fetch(...args) {
  const debut_reponse = await fetch(...args);
  const donnees = await debut_reponse.json();
  return donnees;
}

async function passer_commande_post(commande_body) {
  const donnees = await json_fetch(
    'http://localhost:3000/api/products/order',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(commande_body),
    },
  );
  return donnees;
}

async function passer_commande(infos_formulaire, panier) {
    const products = [];
    for (const element_panier of panier) {
        // Formulaire ignore couleur, voire quantité ????
        products.push(element_panier.id_produit);
    }
    const donnees = await passer_commande_post({
        contact: infos_formulaire,
        products: products,
    });
    return donnees;
}

document.addEventListener("DOMContentLoaded", async () => {
  await main();
}, false);
