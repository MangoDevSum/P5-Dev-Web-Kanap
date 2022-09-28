async function main() {
    await remplir_produit();
}

async function remplir_produit() {
    const id = obtenir_id();
    const produit = await obtenir_produit(id);
    inserer_produit_dans_html(produit);
}

// TODO: obtenir l'id à partir de l'URL
//
// D'après le guide, utiliser:
//   - window.location.href
//   - new URL(...).searchParams.get("id")
//     voir https://waytolearnx.com/2019/10/comment-recuperer-les-parametres-durl-en-javascript.html
function obtenir_id() {
    // "mock implementation"
    return "415b7cacb65d43b2b5c1ff70f3393ad1";
}

async function obtenir_produit(id) {
    // TODO: faire la vraie requête GET auprès de l'API.
    const produit_str = `{"colors":["Black/Yellow","Black/Red"],"_id":"415b7cacb65d43b2b5c1ff70f3393ad1","name":"Kanap Cyllène","price":4499,"imageUrl":"http://localhost:3000/images/kanap02.jpeg","description":"Morbi nec erat aliquam, sagittis urna non, laoreet justo. Etiam sit amet interdum diam, at accumsan lectus.","altTxt":"Photo d'un canapé jaune et noir, quattre places"}`;
    const produit = JSON.parse(produit_str);
    return produit;
}

function inserer_produit_dans_html(produit) {
    // TODO!
    console.log(produit);
    document.getElementById("title").innerText = produit["name"];
}




document.addEventListener("DOMContentLoaded", async () => {
    await main();
}, false);
