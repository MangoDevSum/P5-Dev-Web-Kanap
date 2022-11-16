// Fonctions auxiliaires
import * as util from "./utilitaires.js"
import { $ } from "./utilitaires.js"

// Définition d'une fonction main() qu'on appellera en fin de fichier
async function main() {
  const panier = util.recuperer_local_storage_panier();
  await remplir_html_panier(panier);
  listeners_formulaire();
}

  // Etapes pour afficher le panier
  async function remplir_html_panier(panier) {
    let total_articles = 0;
    let prix_total = 0;
    const articles = [];
    for (const element of panier) {
      const produit = await util.recuperer_produit(element.id_produit);

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

    // Convertir un produit en code html correspondant
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

      // Mettre à jour la quantité dans le panier
      async function changer_qte_element_panier(notre_couleur, notre_id_produit, nouvelle_qte) {
        const panier = util.recuperer_local_storage_panier();
        for (const element of panier) {
          if (element.id_produit == notre_id_produit && element.couleur == notre_couleur) {
            element.quantite = nouvelle_qte;
          }
        }
        localStorage.panier = JSON.stringify(panier);
        await remplir_html_panier(panier);
      }

      // Retirer un article du panier
      async function supprimer_element_panier(notre_couleur, notre_id_produit) {
        const panier = util.recuperer_local_storage_panier();
        // Où se trouve l'entrée du panier correspondante?
        for (const i in panier) {
          if (panier[i].id_produit == notre_id_produit && panier[i].couleur == notre_couleur) {
            // On supprime cette entrée, mais comme `delete panier[i]` la laisse à `null` (panier[i] = null),
            // il nous faut à la place utiliser `splice()`
            panier.splice(i, 1);
            break;
          }
        }
        util.sauvegarder_local_storage_panier(panier);
        await remplir_html_panier(panier);
      }

  // Gestion du formulaire de contact
  function listeners_formulaire() {
    const formulaire = $(".cart__order__form");
    formulaire.addEventListener("submit", gerer_submit_formulaire);
  }

    // Filtrage du contenu des champs du formulaire (Regex)
    async function gerer_submit_formulaire(evenement) {
      // Empêcher le submit de "go through"/s'effectuer.
      evenement.preventDefault();

      const infos_formulaire = lire_infos_formulaire();

      const regle_prenom_ou_nom = /^[A-Z][a-zA-Z\xC0-\xFF '-]{0,99}$/;
      const regle_adresse       = /^[a-z\d\xC0-\xFF ,.'-]+$/i;
      const regle_ville         = /^[A-Z][a-zA-Z\xC0-\xFF ,.'-]{0,99}$/;
      const regle_email         = /^[a-z0-9\._]+@[a-z]+\.[a-z]+$/i;

      let tout_bon = true;

      const prenom_est_valide = regle_prenom_ou_nom.test(infos_formulaire.firstName);
      if (prenom_est_valide == false) {
        $("#firstNameErrorMsg").innerText = "Veuillez écrire un prénom valide";
        tout_bon = false;
      } else {
        $("#firstNameErrorMsg").innerText = "";
      }

      const nom_est_valide = regle_prenom_ou_nom.test(infos_formulaire.lastName);
      if (nom_est_valide == false) {
        $("#lastNameErrorMsg").innerText = "Veuillez écrire un nom valide";
        tout_bon = false;
      } else {
        $("#lastNameErrorMsg").innerText = "";
      }

      const adresse_est_valide = regle_adresse.test(infos_formulaire.address);
      if (adresse_est_valide == false) {
        $("#addressErrorMsg").innerText = "Veuillez fournir une adresse valide";
        tout_bon = false;
      } else {
        $("#addressErrorMsg").innerText = "";
      }

      const ville_est_valide = regle_ville.test(infos_formulaire.city);
      if (ville_est_valide == false) {
        $("#cityErrorMsg").innerText = "Veuillez fournir une ville valide";
        tout_bon = false;
      } else {
        $("#cityErrorMsg").innerText = "";
      }

      const email_est_valide = regle_email.test(infos_formulaire.email);
      if (email_est_valide == false) {
        $("#emailErrorMsg").innerText = "Veuillez écrire une adresse email valide";
        tout_bon = false;
      } else {
        $("#emailErrorMsg").innerText = "";
      }

      if (tout_bon) {
        // Quand tout est validé, on passe la commande:
        const donnees = await passer_commande(infos_formulaire);
        // On en obtient le numéro de commande, avec lequel on redirige
        // l'utilisateur vers la page confirmation
        window.location = `./confirmation.html?commande=${donnees.orderId}`;
      } else {
        // Sinon, on ne redirige pas
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

        // Requête POST pour passer commande
        async function passer_commande(infos_formulaire) {
          const panier = util.recuperer_local_storage_panier();
          const id_produits = [];
          for (const element_panier of panier) {
            // Formulaire ignore couleur, voire quantité ????
            id_produits.push(element_panier.id_produit);
          }
          const objet_a_envoyer = {
            contact: infos_formulaire,
            products: id_produits,
          };
          const donnees = await util.api_post("/order", objet_a_envoyer);
          return donnees;
        }

// Appel à la fonction main()
document.addEventListener("DOMContentLoaded", async () => {
  await main();
}, false);
