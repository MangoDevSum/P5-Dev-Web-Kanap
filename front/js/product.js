// Fonctions auxiliaires
import * as util from "./utilitaires.js"
import { $ } from "./utilitaires.js"

// Remplir la page produit une fois que celle-ci est chargée,
// et rendre fonctionnel le clic d'ajout au panier.
async function main() {
  await remplir_produit();
  ajouter_listener_bouton_panier();
}

  // Etapes pour afficher une fiche produit
  async function remplir_produit() {
    const id_produit = obtenir_id();
    const json_produit = await util.recuperer_produit(id_produit);
    inserer_donnees_dans_html(json_produit);
  }

    // Récuperer l'id produit fourni dans l'url (`product.html?id=...`)
    function obtenir_id() {
      const id = util.recuperer_url_param("id");
      return id;
    }

    // Convertir un produit individuellement en son code html correspondant
    function inserer_donnees_dans_html(produit) {
      // <div class="item__img">
      //     <!-- <img src="../images/logo.png" alt="Photographie d'un canapé"> -->
      // </div>
      const img = document.createElement("img");
      img.src = produit.imageUrl;
      img.alt = produit.altTxt;
      $(".item__img").append(img);

      // <h1 id="title">
      //     <!-- Nom du produit -->
      // </h1>
      $("#title").append(produit.name);

      // <p>Prix : <span id="price"><!-- 42 --></span>€</p>
      $("#price").append(produit.price);

      // <p id="description"><!-- Dis enim malesuada risus sapien gravida nulla nisl arcu. --></p>
      $("#description").append(produit.description);

      for(const couleur of produit.colors) {
        // <option value="vert">vert</option>
        const option = document.createElement("option");
        option.setAttribute("value", couleur);
        option.append(couleur);
        $("#colors").append(option);
      }
    }

  // Mise en place de la gestion du clic sur le bouton "Ajouter au panier"
  function ajouter_listener_bouton_panier() {
    $("#addToCart").addEventListener("click", gerer_clic_panier);
  }

    /**
     * EventListener chargé de gérer l'évènement clic
     *
     * Remarque: on ne peut pas vraiment ajouter des paramètres à nous car c'est un "event listener".
     **/
    function gerer_clic_panier() {
      // Ici on ne peut hélas passer le `id_produit` comme argument, du coup il nous faut
      // le réobtenir comme nous l'avions déjà fait ligne ~13.
      const id_produit = obtenir_id();

      // .value : On obtient ce qu' il y a à l'intérieur de la case, /!\ sous forme de string /!\
      const nbre_articles_str = $("#quantity").value;
      const nbre_articles = parseInt(nbre_articles_str);
      if (nbre_articles == 0) {
        // Possibilité d'afficher un message si la quantité n'est pas sélectionnée:
        // alert("Veuillez choisir le nombre d'articles à ajouter.");
        return;
      }

      const choix_couleurs = $("#colors");
      if (choix_couleurs.selectedIndex == 0) {
        // On est encore à "SVP choisissez une couleur": on n'envoie rien.
        // alert("Veuillez choisir une couleur.");
        return;
      }
      // Formule pour obtenir le string dans un choix déroulant (select).
      const couleur = choix_couleurs.options[choix_couleurs.selectedIndex].value;

      // On peut enfin insérer dans le panier les infos obtenues
      maj_du_local_storage_panier(couleur, id_produit, nbre_articles);

      // Pour finir, on redirige vers la page du panier:
      window.location = "./cart.html";
    }

      /**
       * On *sauvegarde* dans le panier les infos fournies par l'utilisateur,
       * en veillant à fusionner les entrées ayant le même id et couleur.
       **/
      function maj_du_local_storage_panier(couleur, id_produit, nbre_articles) {
        // Utilisation de localStorage:

        // 1. On récupère le panier actuel du LocalStorage
        const panier_actuel = util.recuperer_local_storage_panier();

        // 2. On lui rajoute des éléments (en veillant à fusionner etc)
        const nouveau_panier = ajouter_au_panier(panier_actuel, id_produit, couleur, nbre_articles);

        // 3. On sauvegarde le nouveau panier dans le LocalStorage
        util.sauvegarder_local_storage_panier(nouveau_panier);
      }

        // On insère dans un panier éphémère les infos fournies, en veillant à la non-duplication
        function ajouter_au_panier(panier, notre_id_produit, notre_couleur, nbre_articles) {
          // On regarde si une entrée ayant le même id et couleur est déjà présente
          // (et si oui, où)
          const position = panier.findIndex(element => {
            return element.id_produit == notre_id_produit && element.couleur == notre_couleur;
          });
          if (position == -1) {
            // entrée non trouvée, on en crée une nouvelle.
            panier.push({
              id_produit: notre_id_produit,
              couleur: notre_couleur,
              quantite: nbre_articles,
            });
          } else {
            // entrée trouvée, on y additionne la nouvelle quantité
            panier[position].quantite += nbre_articles;
          }

          return panier;
        }

// Appel à la fonction main() une fois que la page a été chargée
document.addEventListener("DOMContentLoaded", async () => {
  await main();
}, false);
