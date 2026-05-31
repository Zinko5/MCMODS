// Mod database
const MODS = [
    {
        name: "autoclicker",
        slug: "autoclicker",
        description: "Te permite dar clics automáticos y rápidos sin cansarte el dedo. ¡Ideal para granjas!"
    },
    {
        name: "BridgingMod",
        slug: "bridging-mod",
        description: "Te ayuda a colocar bloques hacia atrás o hacia los lados de forma más fácil y rápida para hacer puentes sin caerte. Requiere YACL para funcionar."
    },
    {
        name: "Gamma-Utils",
        slug: "gamma-utils",
        description: "Sirve para ajustar el brillo del juego al máximo. Dile adiós a las cuevas oscuras y a gastar carbón en antorchas."
    },
    {
        name: "Jade",
        slug: "jade",
        description: "Cuando miras un bloque o una criatura, te muestra un pequeño cartel arriba diciendo exactamente qué es y de qué mod viene."
    },
    {
        name: "jei (Just Enough Items)",
        slug: "jei",
        description: "El clásico buscador de objetos. Te muestra una lista a la derecha de la pantalla con todas las recetas para saber cómo se fabrica cualquier cosa."
    },
    {
        name: "justzoom",
        slug: "just-zoom",
        description: "Te permite hacer zoom (acercar la pantalla) presionando una tecla para ver cosas que están muy lejos. Requiere Konkrete para funcionar."
    },
    {
        name: "konkrete",
        slug: "konkrete",
        description: "Este no añade nada visual al juego; es una biblioteca técnica interna que otros mods (zoom) necesitan para poder funcionar bien."
    },
    {
        name: "xaerosminimap",
        slug: "xaeros-minimap",
        description: "Te añade un minimapa muy bonito en una esquina de la pantalla para que veas dónde estás, los enemigos cercanos y no te pierdas."
    },
    {
        name: "xaerosworldmap",
        slug: "xaeros-world-map",
        description: "Es el mapa completo a pantalla completa. Se va dibujando a medida que exploras el mundo y te permite ver todo lo que has descubierto."
    },
    {
        name: "YetAnotherConfigLib (YACL)",
        slug: "yacl",
        description: "Este no añade nada visual al juego; es una biblioteca técnica interna necesaria para que funcione el mod BridgingMod."
    }
];

// Configuration
const MC_VERSION = "26.1.2";
const LOADER = "neoforge";

// DOM Elements
const modsContainer = document.getElementById('mods-container');
const modSearch = document.getElementById('mod-search');
const modCount = document.getElementById('mod-count');

/**
 * Builds a secure Mod Card DOM node following the secure coding guidelines.
 * Uses document.createElement and textContent exclusively.
 */
function createModCard(mod) {
    // Generate URL
    const modrinthUrl = `https://modrinth.com/mod/${mod.slug}?loader=${LOADER}&version=${MC_VERSION}`;

    // Card Container
    const card = document.createElement('a');
    card.setAttribute('href', modrinthUrl);
    card.setAttribute('target', '_blank');
    card.setAttribute('rel', 'noopener noreferrer');
    card.classList.add('mod-card');

    // Content Wrapper
    const cardContent = document.createElement('div');

    // Header
    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');

    const title = document.createElement('h3');
    title.classList.add('mod-title');
    title.textContent = mod.name;

    const badge = document.createElement('span');
    badge.classList.add('mod-badge');
    badge.textContent = "Client";

    cardHeader.appendChild(title);
    cardHeader.appendChild(badge);

    // Description
    const desc = document.createElement('p');
    desc.classList.add('mod-desc');
    desc.textContent = mod.description;

    cardContent.appendChild(cardHeader);
    cardContent.appendChild(desc);

    // Footer
    const cardFooter = document.createElement('div');
    cardFooter.classList.add('card-footer');

    // Version details badge
    const platformPill = document.createElement('div');
    platformPill.classList.add('platform-pill');
    platformPill.textContent = `${LOADER} • v${MC_VERSION}`;

    // Arrow SVG Indicator
    const indicator = document.createElement('span');
    indicator.classList.add('modrinth-link-indicator');
    indicator.textContent = "Ver en Modrinth ";

    const svgNs = "http://www.w3.org/2000/svg";
    const arrowSvg = document.createElementNS(svgNs, "svg");
    arrowSvg.setAttribute("width", "12");
    arrowSvg.setAttribute("height", "12");
    arrowSvg.setAttribute("viewBox", "0 0 24 24");
    arrowSvg.setAttribute("fill", "none");
    arrowSvg.setAttribute("stroke", "currentColor");
    arrowSvg.setAttribute("stroke-width", "2");
    arrowSvg.setAttribute("stroke-linecap", "round");
    arrowSvg.setAttribute("stroke-linejoin", "round");

    const polyline = document.createElementNS(svgNs, "polyline");
    polyline.setAttribute("points", "9 18 15 12 9 6");
    arrowSvg.appendChild(polyline);
    indicator.appendChild(arrowSvg);

    cardFooter.appendChild(platformPill);
    cardFooter.appendChild(indicator);

    card.appendChild(cardContent);
    card.appendChild(cardFooter);

    return card;
}

/**
 * Renders the list of mods based on search query
 */
function renderMods(query = '') {
    // Clear container securely
    modsContainer.replaceChildren();

    const normalizedQuery = query.toLowerCase().trim();
    const filteredMods = MODS.filter(mod =>
        mod.name.toLowerCase().includes(normalizedQuery) ||
        mod.description.toLowerCase().includes(normalizedQuery)
    );

    // Update count indicator
    modCount.textContent = filteredMods.length;

    if (filteredMods.length === 0) {
        const noResults = document.createElement('div');
        noResults.classList.add('no-results');
        noResults.textContent = "No se encontraron mods que coincidan con la búsqueda.";
        modsContainer.appendChild(noResults);
        return;
    }

    filteredMods.forEach(mod => {
        const card = createModCard(mod);
        modsContainer.appendChild(card);
    });
}

// Event Listeners
modSearch.addEventListener('input', (e) => {
    renderMods(e.target.value);
});

// Initial Render
renderMods();
