// définir une fonction main (on l'appellera en fin de fichier)
async function main() {
    await remplir_accueil();
}

async function remplir_accueil() {
    const produits = await obtenir_produits();
    const html = convertir_produits_en_html(produits);
    inserer_html_dans_accueil(html);
}

    async function obtenir_produits() {
        // api_products_str est un string brut, résultat de la requête HTTP
        const api_produits_str = await querir_api_products();
        const produits = extraire_jsons(api_produits_str);
        return produits;
    }

        async function querir_api_products() {
            const response = await fetch(`http://localhost:3000/api/products/`);
            const texte = await response.text();
            return texte;
        }

        function extraire_jsons(api_products_str) {
            return JSON.parse(api_products_str);
        }

    // Astuce: utiliser jqplay.org pour expérimenter
    function convertir_produits_en_html(produits) {
        const html_de_tous_les_produits = [];
        for (const produit of produits) {
            const html_d_un_produit = convertir_produit_en_html(produit);
            html_de_tous_les_produits.push(html_d_un_produit);
        }
        return html_de_tous_les_produits;
    }

        // return `<a href="./product.html?id=${produit._id}">
        //     <article>
        //         <img src="${produit.imageUrl}" alt="${produit.altTxt}" />
        //         <h3 class="productName">${produit.name}</h3>
        //         <p class="productDescription">${produit.description}</p>
        //     </article>
        // </a>`
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
                article.append(h3); // <article><img ... /></article>
                    const p = document.createElement("p");
                    p.class = "productDescription";
                    p.append(produit.description);
                article.append(p);
            a.append(article);
            return a;
        }

    function inserer_html_dans_accueil(html_de_tous_les_produits) {
        const section_items = document.querySelector("#items");
        for (const a of html_de_tous_les_produits) {
            section_items.append(a);
        }
    }

// appel à la fonction main mais que quand la page a été chargée.
// (code trouvé sur internet).
document.addEventListener("DOMContentLoaded", async () => {
    await main();
}, false);
