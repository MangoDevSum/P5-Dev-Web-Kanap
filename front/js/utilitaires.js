// Raccourci pour querySelector
export function $(s) {
  return document.querySelector(s);
}

// Raccourci pour fetch().json()
export async function json_fetch(...args) {
  // Décomposé en plusieurs lignes pour lisibilité.
  const debut_reponse = await fetch(...args);
  const donnees = await debut_reponse.json();
  return donnees;
}

// Base des adresses utilisées pour les requêtes HTTP
// (à l'API du "backend")
const API_URL = "http://localhost:3000/api/products"

export async function api_get(cible_api) {
  return await json_fetch(
    `${API_URL}${cible_api}`,
    {
      method: 'GET',
    },
  );
}

export async function api_post(cible_api, objet_a_envoyer) {
  return await json_fetch(
    `${API_URL}${cible_api}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(objet_a_envoyer),
    },
  );
}

export function recuperer_url_param(nom_du_parametre) {
  const str = window.location.href;
  const url = new URL(str);
  return url.searchParams.get(nom_du_parametre);
}

export function recuperer_local_storage_panier() {
  let panier_actuel;
  // Est-ce que le panier existe déjà ?
  if (localStorage.panier != undefined) { // Si oui,
    // on le récupère en le "dé-stringifiant"
    panier_actuel = JSON.parse(localStorage.panier);
  } else { // sinon,
    // on se fait un tout nouveau panier vide ({} == objet vide, [] == tableau vide).
    panier_actuel = [];
  }
  return panier_actuel;
}
