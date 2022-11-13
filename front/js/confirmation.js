import * as util from "./utilitaires.js"
import { $ } from "./utilitaires.js"

async function main() {
    const no_commande = obtenir_no_commande();
    console.log("no_commande", no_commande);
    $("#orderId").append(no_commande);
}

    function obtenir_no_commande() {
        return util.get_url_param("commande");
    }

document.addEventListener("DOMContentLoaded", async () => {
    await main();
}, false);
