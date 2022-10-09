async function main() {
    await remplir_produit();
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
    // const response = await fetch(`http://localhost:3000/api/products/`);
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
    img.qlt = produit.altTxt;
    document.querySelector(".item__img").appendChild(img);

    // <h1 id="title">
    //     <!-- Nom du produit -->
    // </h1>
    document.querySelector("#title").innerText =
        `${produit.name}`
    ;

    // <p>Prix : <span id="price"><!-- 42 --></span>€</p>
    document.querySelector("#price").innerText =
        `${produit.price}`
    ;

    // <p id="description"><!-- Dis enim malesuada risus sapien gravida nulla nisl arcu. --></p>
    document.querySelector("#description").innerText =
        `${produit.description}`
    ;

    // <select name="color-select" id="colors">
    //     <option value="">--SVP, choisissez une couleur --</option>
    //     <!-- <option value="vert">vert</option>
    //          <option value="blanc">blanc</option> -->
    // </select>
    /* for(const couleur of produit.colors) {
        document.querySelector("#colors").innerHTML +=
            `<option value="${couleur}">${couleur}</option>`
        ;
    // } */

    for(const couleur of produit.colors) {
        const option = document.createElement("option");
        option.value = couleur;
        option.innerText = couleur;

        document.querySelector("#colors").appendChild(option);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await main();
}, false);
