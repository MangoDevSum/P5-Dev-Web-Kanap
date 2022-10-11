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
    $("#addToCart").addEventListener("click", ajouter_au_panier);
}

function ajouter_au_panier() {
    alert("TODO");
}

document.addEventListener("DOMContentLoaded", async () => {
    await main();
}, false);
