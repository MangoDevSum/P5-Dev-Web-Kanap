// Fonctions auxiliaires
import * as util from "./utilitaires.js"
import { $ } from "./utilitaires.js"

// Définition d'une fonction main() qu'on appellera en fin de fichier
// Chargement des différents produits sur la page une fois que le DOM a été chargé
async function main() {
  await remplir_accueil();
}

// Etapes pour afficher l'ensemble des produits
async function remplir_accueil() {
  const produits = await obtenir_produits();
  const html = convertir_produits_en_html(produits);
  inserer_html_dans_accueil(html);
}

  // Requête GET à l'API suivant le document "spécifications fonctionnelles":
  // elle retourne un tableau d'objets produit
  async function obtenir_produits() {
    return await util.api_get('/');
  }

  // Convertir ces produits en son code html correspondant
  function convertir_produits_en_html(produits) {
    const html_de_tous_les_produits = [];
    for (const produit of produits) {
      const html_d_un_produit = convertir_produit_en_html(produit);
      html_de_tous_les_produits.push(html_d_un_produit);
    }
    return html_de_tous_les_produits;
  }

    // Convertir un produit individuellement (en évitant innerText: on privilégie `createElement()`)
    function convertir_produit_en_html(produit) {
      const a = document.createElement("a");
      a.href = `./product.html?id=${produit._id}`;
        const article = document.createElement("article"); // <article></article>
          const img = document.createElement("img"); // <img />
          img.src = produit.imageUrl; // <img src="${produit.imageUrl}" />
          img.alt = produit.altTxt; // <img src="${produit.imageUrl}" alt="${produit.altTxt}" />
        article.append(img); // <article><img ... /></article>
          const h3 = document.createElement("h3");
          h3.class = "productName";
          h3.append(produit.name);
        article.append(h3); // <article><img ... /><h3>...</h3></article>
          const p = document.createElement("p");
          p.class = "productDescription";
          p.append(produit.description);
        article.append(p);
      a.append(article);
      return a;
    }

  // Affichage produit par produit sur la page d'accueil
  function inserer_html_dans_accueil(html_de_tous_les_produits) {
    const section_items = $("#items");
    for (const a of html_de_tous_les_produits) {
      section_items.append(a);
    }
  }

// Appel à la fonction main() une fois que la page a été chargée
document.addEventListener("DOMContentLoaded", async () => {
  await main();
}, false);
