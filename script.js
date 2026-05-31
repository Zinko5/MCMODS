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

// Dynamic Image Loaders for themes
let dinoImages = [];
let alexImages = [];
let victorImages = [];

const MARTIN_DEFAULTS = [
    'martin/ark1.png',
    'martin/ark2.png',
    'martin/ark3.png',
    'martin/ark4.png'
];

const ALEX_DEFAULTS = [
    'alex/Starcraft-PNG-Photos.png',
    'alex/lotr1.png',
    'alex/protoss1.png',
    'alex/protoss2.png',
    'alex/wc1.png'
];

const VICTOR_DEFAULTS = [
    'victor/ds1.png',
    'victor/ds2.png',
    'victor/ds3.png',
    'victor/ds4.png',
    'victor/ds5.png'
];

function checkImageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

async function loadThemeImages(themeName, defaultList, sequentialPattern = false) {
    let images = [];

    // 1. Try parsing directory HTML listing (dev servers)
    try {
        const response = await fetch(`${themeName}/`);
        if (response.ok) {
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const links = Array.from(doc.querySelectorAll('a'));
            const parsed = links
                .map(link => link.getAttribute('href'))
                .filter(href => href && (href.endsWith('.png') || href.endsWith('.jpg') || href.endsWith('.jpeg') || href.endsWith('.webp')))
                .map(href => {
                    if (href.startsWith('http') || href.startsWith('/')) return href;
                    return `${themeName}/${href}`;
                });
            if (parsed.length > 0) {
                images = parsed;
            }
        }
    } catch (e) {
        console.warn(`Could not parse ${themeName}/ folder directory list, trying probe/fallback.`, e);
    }

    // 2. Try sequential probing if pattern requested
    if (images.length === 0 && sequentialPattern) {
        let index = 1;
        let consecutiveFailures = 0;
        const tempImages = [];
        while (consecutiveFailures < 2) {
            const src = `${themeName}/ark${index}.png`;
            const exists = await checkImageExists(src);
            if (exists) {
                tempImages.push(src);
                consecutiveFailures = 0;
            } else {
                consecutiveFailures++;
            }
            index++;
        }
        if (tempImages.length > 0) {
            images = tempImages;
        }
    }

    // 3. Fallback
    if (images.length === 0) {
        images = defaultList;
    }
    return images;
}

async function loadAllThemes() {
    dinoImages = await loadThemeImages('martin', MARTIN_DEFAULTS, true);
    alexImages = await loadThemeImages('alex', ALEX_DEFAULTS, false);
    victorImages = await loadThemeImages('victor', VICTOR_DEFAULTS, false);
    renderMods(modSearch.value);
}

/**
 * Builds a secure Mod Card DOM node following the secure coding guidelines.
 * Uses document.createElement and textContent exclusively.
 */
function createModCard(mod, index) {
    // Generate URL
    const modrinthUrl = `https://modrinth.com/mod/${mod.slug}?loader=${LOADER}&version=${MC_VERSION}`;

    // Card Container
    const card = document.createElement('a');
    card.setAttribute('href', modrinthUrl);
    card.setAttribute('target', '_blank');
    card.setAttribute('rel', 'noopener noreferrer');
    card.classList.add('mod-card');

    // Prehistoric Dino Banner (Hidden by default in CSS, shown in Martin theme)
    const dinoBanner = document.createElement('div');
    dinoBanner.classList.add('card-dino-banner');
    const dinoImg = document.createElement('img');
    const imgListDino = dinoImages.length > 0 ? dinoImages : MARTIN_DEFAULTS;
    const dinoImgSrc = imgListDino[index % imgListDino.length];
    dinoImg.setAttribute('src', dinoImgSrc);
    dinoImg.setAttribute('alt', 'Dinosaurio de Ark');
    dinoBanner.appendChild(dinoImg);
    card.appendChild(dinoBanner);

    // Alex Theme Banner (Hidden by default in CSS, shown in Alex theme)
    const alexBanner = document.createElement('div');
    alexBanner.classList.add('card-alex-banner');
    const alexImg = document.createElement('img');
    const imgListAlex = alexImages.length > 0 ? alexImages : ALEX_DEFAULTS;
    const alexImgSrc = imgListAlex[index % imgListAlex.length];
    alexImg.setAttribute('src', alexImgSrc);
    alexImg.setAttribute('alt', 'Alex Warcraft/Starcraft/LOTR');
    alexBanner.appendChild(alexImg);
    card.appendChild(alexBanner);

    // Victor Theme Banner (Hidden by default in CSS, shown in Victor theme)
    const victorBanner = document.createElement('div');
    victorBanner.classList.add('card-victor-banner');
    const victorImg = document.createElement('img');
    const imgListVictor = victorImages.length > 0 ? victorImages : VICTOR_DEFAULTS;
    const victorImgSrc = imgListVictor[index % imgListVictor.length];
    victorImg.setAttribute('src', victorImgSrc);
    victorImg.setAttribute('alt', 'Victor Dark Souls Knight');
    victorBanner.appendChild(victorImg);
    card.appendChild(victorBanner);

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

    filteredMods.forEach((mod, index) => {
        const card = createModCard(mod, index);
        modsContainer.appendChild(card);
    });
}

// Event Listeners
modSearch.addEventListener('input', (e) => {
    renderMods(e.target.value);
});

const themeSelect = document.getElementById('theme-select');
themeSelect.addEventListener('change', (e) => {
    // Clean up all themes first
    document.body.classList.remove('theme-martin', 'theme-alex', 'theme-victor');
    const mascotImg = document.querySelector('.header-dino-mascot img');
    
    if (e.target.value === 'martin') {
        document.body.classList.add('theme-martin');
        if (mascotImg) mascotImg.setAttribute('src', 'martin/ark2.png');
    } else if (e.target.value === 'alex') {
        document.body.classList.add('theme-alex');
        if (mascotImg) mascotImg.setAttribute('src', 'alex/protoss1.png');
    } else if (e.target.value === 'victor') {
        document.body.classList.add('theme-victor');
        if (mascotImg) mascotImg.setAttribute('src', 'victor/ds3.png');
    } else {
        if (mascotImg) mascotImg.setAttribute('src', 'martin/ark2.png');
    }
});

// Initial Render & Probe
loadAllThemes();
