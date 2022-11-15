// Fonctions auxiliaires
import * as util from "./utilitaires.js"
import { $ } from "./utilitaires.js"

// On obtient le numéro de commande puis on l'affiche
async function main() {
  const no_commande = obtenir_no_commande();
  console.log("no_commande", no_commande);
  $("#orderId").append(no_commande);
}

  // Récupération du numéro de commande
  function obtenir_no_commande() {
    return util.recuperer_url_param("commande");
  }

// Appel à la fonction main()
document.addEventListener("DOMContentLoaded", async () => {
  await main();
}, false);
