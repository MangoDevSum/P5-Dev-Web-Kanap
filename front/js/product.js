async function main() {
    ajouter_listener();
    await remplir_produit();
}

    // Raccourci pratique.
    function $(s) {
        return document.querySelector(s);
    }

async function remplir_produit() {
    const id_produit = obtenir_id();
    const donnees = await recuperer_produit(id_produit);
    inserer_donnees_dans_html(donnees);
}

    function obtenir_id() {
        const str = window.location.href;
        const url = new URL(str);
        const id_produit = url.searchParams.get("id");
        return id_produit;
    }

    async function recuperer_produit(id_produit) {
        const response = await fetch(`http://localhost:3000/api/products/${id_produit}`);
        const donnees = await response.json();
        return donnees;
    }

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
            option.value = couleur;
            option.append(couleur);
            $("#colors").append(option);
        }
    }

function ajouter_listener() {
    $("#addToCart").addEventListener("click", gerer_clic_panier);
}

// On ne peut pas vraiment ajouter des paramètres à nous car c'est un "event listener".
function gerer_clic_panier() {
    // Par exemple, on ne peut hélas pas passer le `id_produit` comme argument, du coup il nous faut
    // le réobtenir comme nous l'avions déjà fait ligne ~12.
    const id_produit = obtenir_id();
    console.log("id_produit:", id_produit);

    // .value : On obtient ce qu' il y a à l'intérieur de la case, /!\ sous forme de string /!\
    const nbre_articles_str = $("#quantity").value;
    const nbre_articles = parseInt(nbre_articles_str);
    if (nbre_articles == 0) {
        alert("Veuillez choisir le nombre d'articles à ajouter.");
        return;
    }
    console.log("nbre_articles:", nbre_articles);

    const choix_couleurs = $("#colors");
    if (choix_couleurs.selectedIndex == 0) {
        // On est encore à "SVP choisissez une couleur": on n'envoie rien.
        alert("Veuillez choisir une couleur.");
        return;
    }
    // Formule pour obtenir le string dans un choix déroulant (select).
    const couleur = choix_couleurs.options[choix_couleurs.selectedIndex].value;
    console.log("couleur:", couleur);

    // Attention, quand on appelle une fonction avec plusieurs arguments/paramètres,
    // il faut garder le même ordre /!\
    maj_du_local_storage_panier(couleur, id_produit, nbre_articles);

    // Pour finir, on redirige vers la page du panier:
    window.location = "./cart.html";
}

    function maj_du_local_storage_panier(couleur, id_produit, nbre_articles) {
        // Utilisation de localStorage:

        // 1. On récupère l'objet à déstringifier ("if any" / si jamais il y en un)
        let panier_actuel;
            // Est-ce que le panier existe déjà ?
            if (localStorage.panier != undefined) { // Si oui,
                // on le récupère en le "dé-stringifiant"
                panier_actuel = JSON.parse(localStorage.panier);
            } else { // sinon,
                // on se fait un tout nouveau panier vide ({} == objet vide, [] == tableau vide).
                panier_actuel = [];
            }

        // 2. On lui rajoute des trucs
        const nouveau_panier = ajouter_au_panier(panier_actuel, id_produit, couleur, nbre_articles);

        // 3. On stocke le nouveau panier (stringifié) à la place.
        localStorage.panier = JSON.stringify(nouveau_panier);
    }

    function ajouter_au_panier(panier, notre_id_produit, notre_couleur, nbre_articles) {

        let position = -1;
        for (const [i, element] of Object.entries(panier)) {
            if (element.id_produit == notre_id_produit && element.couleur == notre_couleur) {
                position = i;
                break;
            }
        }
        // Ou bien:
        {
            const position = panier.findIndex(element => {
                return element.id_produit == notre_id_produit && element.couleur == notre_couleur;
            });
        }

        if (position == -1) {
            panier.push({
                id_produit: notre_id_produit,
                couleur: notre_couleur,
                quantite: nbre_articles,
            });
        } else {
            panier[position].quantite += nbre_articles;
        }

        return panier;
    }

document.addEventListener("DOMContentLoaded", async () => {
    await main();
}, false);

/*
- ☑ Panier partie 1 — ajouter au panier:
     - ☑ récupérer infos du produit lors du clic
     - ☑ fonction pour insérer des infos produit dans le panier
  -  🔲 Panier partie 2 - afficher le panier:
     - ☑ récupérer infos du panier (très facile)
     - ☑ les afficher (un peu fastidieux, mais pas difficile (createElement, append, etc.)
        - 🔲 utiliser createElement à la place de innerHTML
        - 🔲 mettre à jour aussi le prix et quantités totaux.
     - 🔲 au niveau de l'affichage de ce panier, permettre des modifs ultérieures ("supprimer l'élément ou modifier la quantité")
*/
