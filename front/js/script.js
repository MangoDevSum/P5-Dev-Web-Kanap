
function main() {
    remplir_accueil();
}

function remplir_accueil() {
    const produits = obtenir_produits();
    const html = convertir_produits_en_html(produits);
    inserer_html_dans_accueil(html);
}

    function obtenir_produits() {
        const api_products_str = get_api_products();
        const jsons = extraire_jsons(api_products_str);
        return jsons;
    }

        // TODO
        function get_api_products() {
            return `[{"colors":["Blue","White","Black"],"_id":"107fb5b75607497b96722bda5b504926","name":"Kanap Sinopé","price":1849,"imageUrl":"http://localhost:3000/images/kanap01.jpeg","description":"Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.","altTxt":"Photo d'un canapé bleu, deux places"},{"colors":["Black/Yellow","Black/Red"],"_id":"415b7cacb65d43b2b5c1ff70f3393ad1","name":"Kanap Cyllène","price":4499,"imageUrl":"http://localhost:3000/images/kanap02.jpeg","description":"Morbi nec erat aliquam, sagittis urna non, laoreet justo. Etiam sit amet interdum diam, at accumsan lectus.","altTxt":"Photo d'un canapé jaune et noir, quattre places"},{"colors":["Green","Red","Orange"],"_id":"055743915a544fde83cfdfc904935ee7","name":"Kanap Calycé","price":3199,"imageUrl":"http://localhost:3000/images/kanap03.jpeg","description":"Pellentesque fermentum arcu venenatis ex sagittis accumsan. Vivamus lacinia fermentum tortor.Mauris imperdiet tellus ante.","altTxt":"Photo d'un canapé d'angle, vert, trois places"},{"colors":["Pink","White"],"_id":"a557292fe5814ea2b15c6ef4bd73ed83","name":"Kanap Autonoé","price":1499,"imageUrl":"http://localhost:3000/images/kanap04.jpeg","description":"Donec mattis nisl tortor, nec blandit sapien fermentum at. Proin hendrerit efficitur fringilla. Lorem ipsum dolor sit amet.","altTxt":"Photo d'un canapé rose, une à deux place"},{"colors":["Grey","Purple","Blue"],"_id":"8906dfda133f4c20a9d0e34f18adcf06","name":"Kanap Eurydomé","price":2249,"imageUrl":"http://localhost:3000/images/kanap05.jpeg","description":"Ut laoreet vulputate neque in commodo. Suspendisse maximus quis erat in sagittis. Donec hendrerit purus at congue aliquam.","altTxt":"Photo d'un canapé gris, trois places"},{"colors":["Grey","Navy"],"_id":"77711f0e466b4ddf953f677d30b0efc9","name":"Kanap Hélicé","price":999,"imageUrl":"http://localhost:3000/images/kanap06.jpeg","description":"Curabitur vel augue sit amet arcu aliquet interdum. Integer vel quam mi. Morbi nec vehicula mi, sit amet vestibulum.","altTxt":"Photo d'un canapé gris, deux places"},{"colors":["Red","Silver"],"_id":"034707184e8e4eefb46400b5a3774b5f","name":"Kanap Thyoné","price":1999,"imageUrl":"http://localhost:3000/images/kanap07.jpeg","description":"EMauris imperdiet tellus ante, sit amet pretium turpis molestie eu. Vestibulum et egestas eros. Vestibulum non lacus orci.","altTxt":"Photo d'un canapé rouge, deux places"},{"colors":["Pink","Brown","Yellow","White"],"_id":"a6ec5b49bd164d7fbe10f37b6363f9fb","name":"Kanap orthosie","price":3999,"imageUrl":"http://localhost:3000/images/kanap08.jpeg","description":"Mauris molestie laoreet finibus. Aenean scelerisque convallis lacus at dapibus. Morbi imperdiet enim metus rhoncus.","altTxt":"Photo d'un canapé rose, trois places"}]`
        }

        // TODO
        function extraire_jsons(api_products_str) {
            // Astuce: utiliser jqplay.org pour expérimenter
            return [{
                "colors": [
                  "Blue",
                  "White",
                  "Black"
                ],
                "_id": "107fb5b75607497b96722bda5b504926",
                "name": "Kanap Sinopé",
                "price": 1849,
                "imageUrl": "http://localhost:3000/images/kanap01.jpeg",
                "description": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                "altTxt": "Photo d'un canapé bleu, deux places"
              }
              , 2, 3, 4, 5, 6, 7];
        }

    function convertir_produits_en_html(produits) {
        // let i = 0;
        // let s = "";
        // for ... {
        //     i = i + 1;
        //     i += 1;
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
            const imgUrl = produit["imageUrl"];
            return `
                <a href="./product.html?id=42">
                    <article>
                        <img
                            src="${imgUrl}"
                            alt="Lorem ipsum dolor sit amet, Kanap name1"
                        />
                        <h3 class="productName">
                            Kanap name
                        </h3>
                        <p class="productDescription">
                            Dis enim malesuada risus sapien gravida nulla nisl arcu.
                            is enim malesuada risus sapien gravida nulla nisl arcu.
                        </p>
                    </article>
                </a>
            `;
        }

    function inserer_html_dans_accueil(html) {
        const section_items = document.getElementById("items");
        section_items.innerHTML = html;
    }









document.addEventListener("DOMContentLoaded", () => {
    main();
}, false);
