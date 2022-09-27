//definir une fonction main (on l'appellera en fin de fichier)
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

        // TODO: requête HTTP
        async function querir_api_products() {
            /* on fait comme si on avait fait la requête et obtenu la réponse...
            permet de tester le reste du code (qui dépend de cette fonction),
            sans avoir à attendre la vraie implémentation ("mock implementation")
            */
            const response = await fetch(`http://localhost:3000/api/products/`);
            // const response = await fetch(`http://localhost:3000/api/products/${id}`);
            return await response.text();
        }

        function extraire_jsons(api_products_str) {
            return JSON.parse(api_products_str);
        }

    // Astuce: utiliser jqplay.org pour expérimenter
    function convertir_produits_en_html(produits) {
        // let i = 0;
        // for ... {
        //     i = i + 1;
        //     i += 1;
        // }
        //
        // let s = "";
        // for ... {
        //     s = s + "un truc";
        //     s += "un truc";
        // }
        let html_de_tous_les_produits = "";
        for (const produit of produits) {
            const html_d_un_produit = convertir_produit_en_html(produit);
            html_de_tous_les_produits += html_d_un_produit;
        }
        return html_de_tous_les_produits;
    }

        // TODO
        function convertir_produit_en_html(produit) {
            const src = produit["imageUrl"];
            const h3 = produit["name"];
            const id = produit["_id"];
            const alt = produit["altTxt"];
            const p = produit["description"];
            return `
                <a href="./product.html?${id}">
                    <article>
                        <img
                            src="${src}"
                            alt="${alt}"
                        />
                        <h3 class="productName">
                        ${h3}
                        </h3>
                        <p class="productDescription">
                        ${p}
                        </p>
                    </article>
                </a>
            `;
        }

    function inserer_html_dans_accueil(html) {
        const section_items = document.getElementById("items");
        section_items.innerHTML = html;
    }







//appel à la fonction main (normal)
// main();

// appel à la fonction main mais que quand la page a été chargée.
// (code trouvé sur internet).
document.addEventListener("DOMContentLoaded", async () => {
    await main();
}, false);
