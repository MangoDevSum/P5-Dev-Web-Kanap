async function main() {
    const no_commande = obtenir_no_commande();
    console.log("no_commande", no_commande);
    document.querySelector("#orderId").append(no_commande);
}

function obtenir_no_commande() {
    const str = window.location.href;
    const url = new URL(str);
    return url.searchParams.get("commande");
}

document.addEventListener("DOMContentLoaded", async () => {
    await main();
}, false);
