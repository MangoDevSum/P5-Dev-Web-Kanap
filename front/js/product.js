async function main() {
    await remplir_produit();
}

async function remplir_produit() {
    const id_produit = obtenir_id();
    console.log(id_produit);
    const donnees = await recuperer_produit(id_produit);
    console.log(donnees);
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
    /* == COURS == */
    let nom;
    // pt de vue objet. On accède à une propriété/attribut. Syntaxe: .name
    nom = produit.name; // plus épuré
    // pt de vue dictionnaire (a map). On indexe par clé "string". Syntaxe: ["name"]
    nom = produit["name"]; // plus flexible

    // "comme en CSS/HTML"
    document.querySelector(".nom-de-classe")
    document.querySelector("#nom-de-id")

    // for (const color of produit.colors) {
    //     document... += `
    //         <option ...>
    //     `;
    // }

    /* == CODE == */
    // <div class="item__img">
    //     <!-- <img src="../images/logo.png" alt="Photographie d'un canapé"> -->
    // </div>
    document.querySelector(".item__img").innerHTML = `
        <img src="${produit.imageUrl}" alt="${produit.altTxt}">
    `;

    document.querySelector("#title").innerText = `
        ${produit.name}
    `;

    document.querySelector("#price").innerText = `
        ${produit.price}
    `;

    document.querySelector("#description").innerText = `
        ${produit.description}
    `;

    // <h1 id="title">
    //     <!-- Nom du produit -->
    // </h1>

    //boucle for
    // document.querySelector("").innerText = `

    // `;


}

document.addEventListener("DOMContentLoaded", async () => {
    await main();
}, false);
