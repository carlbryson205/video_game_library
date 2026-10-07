"use strict";

const STORAGE_KEY = "gameshelf-games-v2";
const LEGACY_STORAGE_KEY = "gameshelf-games";
const PREFS_KEY = "gameshelf-preferences";
const COLOR_NAMES = ["one", "two", "three", "four", "five", "six"];
const CURRENT_YEAR = new Date().getFullYear();
const PLATFORM_OPTIONS = ["Switch", "PC", "PlayStation 5", "PlayStation 4", "Xbox Series X|S", "Xbox One", "Steam Deck", "Nintendo 3DS", "Other"];

const starterGames = [
  { id: "starter-1", title: "Hades", platform: "Switch", edition: "Standard", releaseYear: 2020, status: "playing", ownership: "owned", format: "digital", rating: 5, completionPercent: 68, hoursPlayed: 42.5, tags: ["action", "roguelike"], favorite: true, notes: "A favorite for quick runs.", color: "one" },
  { id: "starter-2", title: "Sea of Stars", platform: "PC", releaseYear: 2023, status: "backlog", ownership: "owned", format: "digital", rating: 4, tags: ["rpg", "pixel art"], favorite: false, color: "two" },
  { id: "starter-3", title: "Celeste", platform: "PC", releaseYear: 2018, status: "completed", ownership: "owned", format: "digital", rating: 5, completionPercent: 100, hoursPlayed: 18.2, tags: ["platformer"], favorite: true, color: "three" },
  { id: "starter-4", title: "The Legend of Zelda: Tears of the Kingdom", platform: "Switch", releaseYear: 2023, status: "backlog", ownership: "owned", format: "physical", tags: ["adventure"], favorite: false, color: "four" },
  { id: "starter-5", title: "Baldur's Gate 3", platform: "PlayStation 5", releaseYear: 2023, status: "playing", ownership: "owned", format: "digital", rating: 5, completionPercent: 44, hoursPlayed: 57.8, tags: ["rpg", "co-op"], favorite: true, color: "five" },
  { id: "starter-6", title: "Stardew Valley", platform: "Steam Deck", releaseYear: 2016, status: "paused", ownership: "owned", format: "digital", rating: 4, completionPercent: 35, hoursPlayed: 63, tags: ["cozy", "farming"], favorite: false, color: "six" }
];

const catalogSeed = [
  ["A Short Hike", "PC", "Adventure", 2019], ["A Plague Tale: Requiem", "PlayStation 5", "Adventure", 2022], ["Animal Well", "Switch", "Metroidvania", 2024], ["Armored Core VI", "PlayStation 5", "Action", 2023], ["Astro Bot", "PlayStation 5", "Platformer", 2024],
  ["Balatro", "Steam Deck", "Card game", 2024], ["Banjo-Kazooie", "Switch", "Platformer", 1998], ["Bayonetta 3", "Switch", "Action", 2022], ["Bioshock", "PC", "Shooter", 2007], ["Black Myth: Wukong", "PC", "Action RPG", 2024],
  ["Blasphemous", "Switch", "Metroidvania", 2019], ["Bloodborne", "PlayStation 5", "Action RPG", 2015], ["Bluey: The Videogame", "Switch", "Family", 2023], ["Braid: Anniversary Edition", "PC", "Puzzle", 2024], ["Brotato", "Steam Deck", "Action", 2022],
  ["Call of Duty: Black Ops 6", "Xbox Series X|S", "Shooter", 2024], ["Captain Toad: Treasure Tracker", "Switch", "Puzzle", 2014], ["Cassette Beasts", "PC", "RPG", 2023], ["Chained Echoes", "Steam Deck", "RPG", 2022], ["Chicory: A Colorful Tale", "PC", "Adventure", 2021],
  ["Cities: Skylines II", "PC", "Simulation", 2023], ["Control", "PlayStation 5", "Action", 2019], ["Cocoon", "Xbox Series X|S", "Puzzle", 2023], ["Cult of the Lamb", "Switch", "Action", 2022], ["Cuphead", "Xbox Series X|S", "Platformer", 2017],
  ["Dark Souls III", "PlayStation 5", "Action RPG", 2016], ["Dave the Diver", "Steam Deck", "Adventure", 2023], ["Dead Cells", "Switch", "Roguelike", 2018], ["Death Stranding Director's Cut", "PlayStation 5", "Adventure", 2021], ["Deep Rock Galactic", "Xbox Series X|S", "Co-op", 2020],
  ["Disco Elysium", "PC", "RPG", 2019], ["Donkey Kong Country: Tropical Freeze", "Switch", "Platformer", 2014], ["Dredge", "Switch", "Adventure", 2023], ["Elden Ring", "PlayStation 5", "Action RPG", 2022], ["Eiyuden Chronicle: Hundred Heroes", "PC", "RPG", 2024],
  ["Enter the Gungeon", "Switch", "Roguelike", 2016], ["Everybody's Golf", "PlayStation 5", "Sports", 2024], ["Exoprimal", "Xbox Series X|S", "Action", 2023], ["Fable Anniversary", "Xbox Series X|S", "RPG", 2014], ["Final Fantasy VII Rebirth", "PlayStation 5", "RPG", 2024],
  ["Fire Emblem: Three Houses", "Switch", "Strategy RPG", 2019], ["Firewatch", "PC", "Adventure", 2016], ["Forza Horizon 5", "Xbox Series X|S", "Racing", 2021], ["Frostpunk", "PC", "Strategy", 2018], ["Ghost of Tsushima Director's Cut", "PlayStation 5", "Action", 2021],
  ["Ghost Trick: Phantom Detective", "Switch", "Puzzle", 2023], ["Gris", "Steam Deck", "Platformer", 2018], ["Grounded", "Xbox Series X|S", "Survival", 2022], ["Hi-Fi Rush", "Xbox Series X|S", "Rhythm action", 2023], ["Hollow Knight", "Switch", "Metroidvania", 2017],
  ["House Flipper 2", "PC", "Simulation", 2023], ["Immortals Fenyx Rising", "Switch", "Adventure", 2020], ["Inscryption", "PC", "Card game", 2021], ["It Takes Two", "PlayStation 5", "Co-op", 2021], ["Jusant", "Xbox Series X|S", "Adventure", 2023],
  ["Katana ZERO", "Switch", "Action", 2019], ["Kirby and the Forgotten Land", "Switch", "Platformer", 2022], ["Lies of P", "PlayStation 5", "Action RPG", 2023], ["Like a Dragon: Infinite Wealth", "PlayStation 5", "RPG", 2024], ["Little Nightmares II", "PC", "Horror", 2021],
  ["Lords of the Fallen", "PlayStation 5", "Action RPG", 2023], ["Luigi's Mansion 3", "Switch", "Adventure", 2019], ["Marvel's Spider-Man 2", "PlayStation 5", "Action", 2023], ["Mass Effect Legendary Edition", "PC", "RPG", 2021], ["Metroid Dread", "Switch", "Metroidvania", 2021],
  ["Minecraft", "Xbox Series X|S", "Sandbox", 2011], ["Monster Hunter Rise", "Switch", "Action RPG", 2021], ["Moonlighter", "Steam Deck", "Action RPG", 2018], ["Mortal Kombat 1", "PlayStation 5", "Fighting", 2023], ["Neon White", "Switch", "Action", 2022],
  ["New Pokémon Snap", "Switch", "Adventure", 2021], ["Nine Sols", "PC", "Metroidvania", 2024], ["No Man's Sky", "PlayStation 5", "Exploration", 2016], ["Octopath Traveler II", "Switch", "RPG", 2023], ["Ori and the Will of the Wisps", "Xbox Series X|S", "Platformer", 2020],
  ["Outer Wilds", "PC", "Exploration", 2019], ["Overcooked! All You Can Eat", "PlayStation 5", "Co-op", 2020], ["Paper Mario: The Thousand-Year Door", "Switch", "RPG", 2024], ["Pentiment", "Xbox Series X|S", "Adventure", 2022], ["Persona 5 Royal", "Steam Deck", "RPG", 2019],
  ["Pikmin 4", "Switch", "Strategy", 2023], ["PowerWash Simulator", "PC", "Simulation", 2022], ["Prince of Persia: The Lost Crown", "Switch", "Metroidvania", 2024], ["Psychonauts 2", "Xbox Series X|S", "Platformer", 2021], ["Ratchet & Clank: Rift Apart", "PlayStation 5", "Action", 2021],
  ["Remnant II", "PlayStation 5", "Action RPG", 2023], ["Return of the Obra Dinn", "PC", "Puzzle", 2018], ["Roboquest", "Xbox Series X|S", "Shooter", 2023], ["Rogue Legacy 2", "Steam Deck", "Roguelike", 2022], ["Sable", "PC", "Adventure", 2021],
  ["Sackboy: A Big Adventure", "PlayStation 5", "Platformer", 2020], ["Sifu", "PlayStation 5", "Action", 2022], ["Signalis", "PC", "Horror", 2022], ["Slay the Spire", "Steam Deck", "Card game", 2019], ["Sonic Mania", "Switch", "Platformer", 2017],
  ["Spiritfarer", "Switch", "Management", 2020], ["Splatoon 3", "Switch", "Shooter", 2022], ["Star Wars Jedi: Survivor", "PlayStation 5", "Action", 2023], ["Subnautica", "Xbox Series X|S", "Survival", 2018], ["Super Mario Bros. Wonder", "Switch", "Platformer", 2023],
  ["Tales of Arise", "PlayStation 5", "RPG", 2021], ["Tetris Effect: Connected", "Xbox Series X|S", "Puzzle", 2020], ["The Case of the Golden Idol", "PC", "Puzzle", 2022], ["The Forgotten City", "Steam Deck", "Adventure", 2021], ["The Last of Us Part I", "PlayStation 5", "Adventure", 2022],
  ["The Talos Principle 2", "PC", "Puzzle", 2023], ["The Witcher 3: Wild Hunt", "PlayStation 5", "RPG", 2015], ["Tinykin", "Switch", "Platformer", 2022], ["Triangle Strategy", "Switch", "Strategy RPG", 2022], ["Tunic", "Xbox Series X|S", "Adventure", 2022],
  ["Unpacking", "PC", "Puzzle", 2021], ["Valheim", "PC", "Survival", 2021], ["Vampire Survivors", "Steam Deck", "Roguelike", 2022], ["Viewfinder", "PlayStation 5", "Puzzle", 2023], ["What Remains of Edith Finch", "PC", "Adventure", 2017],
  ["Wildfrost", "Steam Deck", "Card game", 2023], ["Wilmot's Warehouse", "Switch", "Puzzle", 2019], ["Wolfenstein: The New Order", "Xbox Series X|S", "Shooter", 2014], ["Yakuza: Like a Dragon", "PlayStation 5", "RPG", 2020], ["Yoshi's Crafted World", "Switch", "Platformer", 2019],
  ["Zenless Zone Zero", "PC", "Action RPG", 2024], ["Zelda: Link's Awakening", "Switch", "Adventure", 2019], ["Zero Escape: The Nonary Games", "PC", "Puzzle", 2017], ["Ziggurat 2", "Steam Deck", "Roguelike", 2021]
].map((game, index) => ({ id: `catalog-${index + 1}`, title: game[0], platform: game[1], genre: game[2], year: game[3], color: ["one", "two", "three", "four", "five", "six"][index % 6] })).slice(0, 100);

const $ = function (selector) { return document.querySelector(selector); };
const $$ = function (selector) { return Array.from(document.querySelectorAll(selector)); };

function safeParse(value, fallback) {
  try { return value ? JSON.parse(value) : fallback; } catch (error) { return fallback; }
}

function loadPreferences() {
  return Object.assign({ view: "grid", pageSize: 25, sort: "title-asc" }, safeParse(localStorage.getItem(PREFS_KEY), {}));
}

let preferences = loadPreferences();
let games = loadGames();
let state = {
  query: "",
  platform: "all",
  status: "all",
  ownership: "all",
  format: "all",
  favorite: "all",
  rating: "0",
  completion: "",
  year: "",
  tag: "all",
  sort: preferences.sort || "title-asc",
  view: preferences.view || "grid",
  page: 1,
  pageSize: Number(preferences.pageSize) || 25,
  trash: false
};
let editingId = null;
let duplicateAllowed = false;
let detailId = null;
let pendingConfirmation = null;
let toastTimer = null;
let searchTimer = null;

function nowIso() { return new Date().toISOString(); }

function normalizeGame(raw, index) {
  const created = raw.createdAt || (Number(raw.added) > 1000000000 ? new Date(Number(raw.added)).toISOString() : new Date(Date.now() - ((index || 0) + 1) * 86400000).toISOString());
  const oldFormat = String(raw.format || "unknown").toLowerCase();
  return {
    id: String(raw.id || ("game-" + Date.now() + "-" + index)),
    title: String(raw.title || "").trim(),
    platform: String(raw.platform || "").trim(),
    customPlatform: String(raw.customPlatform || "").trim(),
    edition: String(raw.edition || "").trim(),
    releaseYear: raw.releaseYear ? Number(raw.releaseYear) : null,
    status: raw.status === "unplayed" ? "backlog" : (raw.status || "backlog"),
    ownership: raw.ownership || "owned",
    format: ["physical", "digital", "streaming", "unknown"].includes(oldFormat) ? oldFormat : "unknown",
    rating: raw.rating ? Number(raw.rating) : null,
    completionPercent: raw.completionPercent === 0 || raw.completionPercent ? Number(raw.completionPercent) : null,
    hoursPlayed: raw.hoursPlayed === 0 || raw.hoursPlayed ? Number(raw.hoursPlayed) : null,
    purchasePrice: raw.purchasePrice === 0 || raw.purchasePrice ? Number(raw.purchasePrice) : null,
    currency: raw.currency || "USD",
    purchaseDate: raw.purchaseDate || "",
    acquiredFrom: String(raw.acquiredFrom || "").trim(),
    startedOn: raw.startedOn || "",
    completedOn: raw.completedOn || "",
    tags: Array.isArray(raw.tags) ? raw.tags.map(function (tag) { return String(tag).trim(); }).filter(Boolean).slice(0, 20) : [],
    favorite: Boolean(raw.favorite),
    notes: String(raw.notes || ""),
    color: COLOR_NAMES.includes(raw.color) ? raw.color : COLOR_NAMES[index % COLOR_NAMES.length],
    createdAt: created,
    updatedAt: raw.updatedAt || created,
    deletedAt: raw.deletedAt || "",
    version: Number(raw.version) || 1
  };
}

function loadGames() {
  const saved = safeParse(localStorage.getItem(STORAGE_KEY), null);
  const legacy = safeParse(localStorage.getItem(LEGACY_STORAGE_KEY), null);
  const source = Array.isArray(saved) ? saved : (Array.isArray(legacy) ? legacy : starterGames);
  const cutoff = Date.now() - 30 * 86400000;
  return source.map(normalizeGame).filter(function (game) {
    return !game.deletedAt || new Date(game.deletedAt).getTime() > cutoff;
  });
}

function saveGames() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    return true;
  } catch (error) {
    notify("Your change could not be saved. Your form values are still here.", true);
    return false;
  }
}

function savePreferences() {
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(preferences)); return true; }
  catch (error) { notify("Preferences could not be saved.", true); return false; }
}

function notify(message, isError) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.toggle("error", Boolean(isError));
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toast.hidden = true; }, 4500);
}

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character];
  });
}

function normalizeText(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}

function statusLabel(value) {
  return { backlog: "Unplayed", playing: "Playing", paused: "Paused", completed: "Completed", abandoned: "Abandoned" }[value] || value;
}

function ownershipLabel(value) {
  return { owned: "Owned", wishlist: "Wishlist", borrowed: "Borrowed", lent: "Lent", subscription: "Subscription", sold_traded: "Sold / traded" }[value] || value;
}

function formatLabel(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "Unknown";
}

function gamePlatform(game) {
  return game.platform === "Other" && game.customPlatform ? game.customPlatform : game.platform;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value.length === 10 ? value + "T12:00:00" : value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "numeric" }).format(date);
}

function stars(value) {
  return value ? "★".repeat(value) + "☆".repeat(5 - value) : "Not rated";
}

function stableCompare(a, b) {
  return a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: "base" }) || String(a.id).localeCompare(String(b.id));
}

function sortGames(items) {
  const sort = state.sort;
  return items.slice().sort(function (a, b) {
    let result = 0;
    if (sort === "title-asc") result = stableCompare(a, b);
    else if (sort === "title-desc") result = -stableCompare(a, b);
    else if (sort === "added-desc") result = new Date(b.createdAt) - new Date(a.createdAt);
    else if (sort === "added-asc") result = new Date(a.createdAt) - new Date(b.createdAt);
    else if (sort === "updated-desc") result = new Date(b.updatedAt) - new Date(a.updatedAt);
    else if (sort === "rating-desc") result = (a.rating == null) - (b.rating == null) || (b.rating || 0) - (a.rating || 0);
    else if (sort === "year-desc") result = (a.releaseYear == null) - (b.releaseYear == null) || (b.releaseYear || 0) - (a.releaseYear || 0);
    else if (sort === "platform-asc") result = gamePlatform(a).localeCompare(gamePlatform(b), undefined, { numeric: true, sensitivity: "base" });
    return result || stableCompare(a, b);
  });
}

function matchesQuery(game) {
  const tokens = normalizeText(state.query).trim().split(/\s+/).filter(Boolean);
  if (!tokens.length) return true;
  const searchable = normalizeText([game.title, game.edition, gamePlatform(game)].concat(game.tags).join(" "));
  return tokens.every(function (token) { return searchable.includes(token); });
}

function filteredGames() {
  return sortGames(games.filter(function (game) {
    if (Boolean(game.deletedAt) !== state.trash) return false;
    if (!matchesQuery(game)) return false;
    if (state.platform !== "all" && gamePlatform(game) !== state.platform) return false;
    if (state.status !== "all" && game.status !== state.status) return false;
    if (state.ownership !== "all" && game.ownership !== state.ownership) return false;
    if (state.format !== "all" && game.format !== state.format) return false;
    if (state.favorite === "yes" && !game.favorite) return false;
    if (state.favorite === "no" && game.favorite) return false;
    if (Number(state.rating) && (!game.rating || game.rating < Number(state.rating))) return false;
    if (state.completion !== "" && (game.completionPercent == null || game.completionPercent < Number(state.completion))) return false;
    if (state.year !== "" && (game.releaseYear == null || game.releaseYear < Number(state.year))) return false;
    if (state.tag !== "all" && !game.tags.some(function (tag) { return normalizeText(tag) === normalizeText(state.tag); })) return false;
    return true;
  }));
}

function render() {
  populateLibraryFacets();
  const results = filteredGames();
  const totalActive = games.filter(function (game) { return !game.deletedAt; }).length;
  const totalPages = Math.max(1, Math.ceil(results.length / state.pageSize));
  state.page = Math.min(Math.max(1, state.page), totalPages);
  const start = (state.page - 1) * state.pageSize;
  const pageItems = results.slice(start, start + state.pageSize);

  $("#total-count").textContent = totalActive;
  $("#playing-count").textContent = games.filter(function (game) { return !game.deletedAt && game.status === "playing"; }).length;
  $("#backlog-count").textContent = games.filter(function (game) { return !game.deletedAt && game.status === "backlog"; }).length;
  $("#favorite-count").textContent = games.filter(function (game) { return !game.deletedAt && game.favorite; }).length;
  $("#result-count").textContent = results.length ? ((start + 1) + "–" + Math.min(start + state.pageSize, results.length) + " of " + results.length + " matching · " + totalActive + " total") : ("0 matching · " + totalActive + " total");
  $("#show-trash").textContent = state.trash ? "Back to library" : ("Trash (" + games.filter(function (game) { return game.deletedAt; }).length + ")");
  $("#open-add").hidden = state.trash;
  $("#clear-search").hidden = !state.query;
  $("#library-results").className = "game-grid " + (state.view === "list" ? "list-view" : "");
  $("#toggle-view").textContent = state.view === "list" ? "▦" : "☷";
  $("#toggle-view").setAttribute("aria-label", state.view === "list" ? "Switch to grid view" : "Switch to list view");
  $("#library-results").innerHTML = pageItems.map(renderCard).join("");
  $("#empty-state").hidden = results.length > 0;
  $("#empty-title").textContent = state.trash ? "Trash is empty" : (state.query || hasFilters() ? "No matching games" : "Your library is empty");
  $("#empty-copy").textContent = state.trash ? "Games moved to trash stay recoverable for 30 days." : (state.query || hasFilters() ? "Clear the search or filters to see more of your collection." : "Add your first game to start building your collection.");
  $("#empty-add").hidden = state.trash;
  $("#empty-clear").hidden = state.trash || (!state.query && !hasFilters());
  renderPagination(results.length, totalPages);
  renderFilterChips();
  renderCatalog();
  syncControls();
  updateUrl();
}

function renderCard(game) {
  const edition = game.edition ? " · " + escapeHtml(game.edition) : "";
  const progress = game.completionPercent == null ? "" : ("<span>" + game.completionPercent + "% complete</span>");
  const trashInfo = game.deletedAt ? ("<p class=\"purge-note\">Permanently removes " + escapeHtml(formatDate(new Date(new Date(game.deletedAt).getTime() + 30 * 86400000).toISOString())) + "</p>") : "";
  const actions = game.deletedAt
    ? "<button class=\"button secondary compact\" data-action=\"restore\" data-id=\"" + escapeHtml(game.id) + "\">Restore</button><button class=\"text-button danger-text\" data-action=\"delete\" data-id=\"" + escapeHtml(game.id) + "\">Delete forever</button>"
    : "<button class=\"favorite " + (game.favorite ? "active" : "") + "\" data-action=\"favorite\" data-id=\"" + escapeHtml(game.id) + "\" aria-label=\"" + (game.favorite ? "Remove " : "Add ") + escapeHtml(game.title) + (game.favorite ? " from" : " to") + " favorites\">" + (game.favorite ? "★" : "☆") + "</button><button class=\"text-button\" data-action=\"details\" data-id=\"" + escapeHtml(game.id) + "\">Details</button><button class=\"text-button\" data-action=\"edit\" data-id=\"" + escapeHtml(game.id) + "\">Edit</button><button class=\"text-button danger-text\" data-action=\"trash\" data-id=\"" + escapeHtml(game.id) + "\">Trash</button>";
  return "<article class=\"library-card\"><div class=\"cover " + escapeHtml(game.color) + "\" aria-hidden=\"true\">" + escapeHtml(game.title.charAt(0).toUpperCase()) + "</div><div class=\"card-content\"><div class=\"card-title-row\"><h2>" + escapeHtml(game.title) + "</h2>" + (!game.deletedAt && game.favorite ? "<span class=\"favorite-mark\" aria-label=\"Favorite\">★</span>" : "") + "</div><p>" + escapeHtml(gamePlatform(game)) + edition + " · " + escapeHtml(formatLabel(game.format)) + "</p><div class=\"card-badges\"><span class=\"status-pill\">" + escapeHtml(game.deletedAt ? "Trashed" : statusLabel(game.status)) + "</span><span class=\"ownership-pill\">" + escapeHtml(ownershipLabel(game.ownership)) + "</span></div><div class=\"card-facts\"><span title=\"Rating\">" + escapeHtml(stars(game.rating)) + "</span>" + progress + "</div>" + trashInfo + "<div class=\"card-actions\">" + actions + "</div></div></article>";
}

function renderPagination(total, totalPages) {
  const nav = $("#pagination");
  if (totalPages <= 1) { nav.innerHTML = ""; nav.hidden = true; return; }
  nav.hidden = false;
  let html = "<button type=\"button\" data-page=\"" + (state.page - 1) + "\" " + (state.page === 1 ? "disabled" : "") + ">Previous</button>";
  for (let page = 1; page <= totalPages; page += 1) {
    if (totalPages > 7 && page > 2 && page < totalPages - 1 && Math.abs(page - state.page) > 1) {
      if (page === 3 || page === totalPages - 2) html += "<span aria-hidden=\"true\">…</span>";
      continue;
    }
    html += "<button type=\"button\" data-page=\"" + page + "\" " + (page === state.page ? "aria-current=\"page\"" : "") + ">" + page + "</button>";
  }
  html += "<button type=\"button\" data-page=\"" + (state.page + 1) + "\" " + (state.page === totalPages ? "disabled" : "") + ">Next</button>";
  nav.innerHTML = html;
}

function populateLibraryFacets() {
  const currentPlatform = state.platform;
  const currentTag = state.tag;
  const platforms = Array.from(new Set(games.map(gamePlatform).filter(Boolean))).sort();
  const tags = Array.from(new Set(games.reduce(function (all, game) { return all.concat(game.tags); }, []))).sort(function (a, b) { return a.localeCompare(b); });
  $("#platform-filter").innerHTML = "<option value=\"all\">All platforms</option>" + platforms.map(function (platform) { return "<option>" + escapeHtml(platform) + "</option>"; }).join("");
  $("#tag-filter").innerHTML = "<option value=\"all\">All tags</option>" + tags.map(function (tag) { return "<option>" + escapeHtml(tag) + "</option>"; }).join("");
  $("#platform-filter").value = platforms.includes(currentPlatform) ? currentPlatform : "all";
  if (!platforms.includes(currentPlatform) && currentPlatform !== "all") state.platform = "all";
  $("#tag-filter").value = tags.includes(currentTag) ? currentTag : "all";
  if (!tags.includes(currentTag) && currentTag !== "all") state.tag = "all";
}

function hasFilters() {
  return ["platform", "status", "ownership", "format", "favorite", "tag"].some(function (key) { return state[key] !== "all"; }) || Number(state.rating) > 0 || state.completion !== "" || state.year !== "";
}

function renderFilterChips() {
  const definitions = [
    ["platform", state.platform !== "all" ? state.platform : ""],
    ["status", state.status !== "all" ? statusLabel(state.status) : ""],
    ["ownership", state.ownership !== "all" ? ownershipLabel(state.ownership) : ""],
    ["format", state.format !== "all" ? formatLabel(state.format) : ""],
    ["favorite", state.favorite === "yes" ? "Favorites" : (state.favorite === "no" ? "Not favorites" : "")],
    ["rating", Number(state.rating) ? state.rating + "+ stars" : ""],
    ["completion", state.completion !== "" ? state.completion + "% complete" : ""],
    ["year", state.year !== "" ? "Released " + state.year + " or later" : ""],
    ["tag", state.tag !== "all" ? "Tag: " + state.tag : ""]
  ].filter(function (item) { return item[1]; });
  $("#active-filter-row").hidden = definitions.length === 0;
  $("#filter-chips").innerHTML = definitions.map(function (item) {
    return "<button class=\"filter-chip\" type=\"button\" data-clear-filter=\"" + item[0] + "\">" + escapeHtml(item[1]) + " <span aria-hidden=\"true\">×</span></button>";
  }).join("");
}

function syncControls() {
  $("#search-games").value = state.query;
  $("#platform-filter").value = state.platform;
  $("#status-filter").value = state.status;
  $("#ownership-filter").value = state.ownership;
  $("#format-filter").value = state.format;
  $("#favorite-filter").value = state.favorite;
  $("#rating-filter").value = state.rating;
  $("#completion-filter").value = state.completion;
  $("#year-filter").value = state.year;
  $("#tag-filter").value = state.tag;
  $("#sort-games").value = state.sort;
  $("#page-size").value = String(state.pageSize);
}

function updateUrl() {
  const params = new URLSearchParams();
  const defaults = { platform: "all", status: "all", ownership: "all", format: "all", favorite: "all", rating: "0", completion: "", year: "", tag: "all", sort: "title-asc", view: "grid", page: 1, pageSize: 25, trash: false };
  if (state.query) params.set("q", state.query);
  Object.keys(defaults).forEach(function (key) {
    if (state[key] !== defaults[key]) params.set(key === "pageSize" ? "size" : key, String(state[key]));
  });
  const next = location.pathname + (params.toString() ? "?" + params.toString() : "") + location.hash;
  history.replaceState(null, "", next);
}

function applyUrlState() {
  const params = new URLSearchParams(location.search);
  state.query = (params.get("q") || "").slice(0, 100);
  ["platform", "status", "ownership", "format", "favorite", "rating", "completion", "year", "tag", "sort", "view"].forEach(function (key) {
    if (params.has(key)) state[key] = params.get(key);
  });
  state.page = Math.max(1, Number(params.get("page")) || 1);
  state.pageSize = [25, 50, 100].includes(Number(params.get("size"))) ? Number(params.get("size")) : state.pageSize;
  state.trash = params.get("trash") === "true";
  if (!["all", "backlog", "playing", "paused", "completed", "abandoned"].includes(state.status)) state.status = "all";
  if (!["all", "owned", "wishlist", "borrowed", "lent", "subscription", "sold_traded"].includes(state.ownership)) state.ownership = "all";
  if (!["all", "physical", "digital", "streaming", "unknown"].includes(state.format)) state.format = "all";
  if (!["all", "yes", "no"].includes(state.favorite)) state.favorite = "all";
  if (!["0", "1", "2", "3", "4", "5"].includes(state.rating)) state.rating = "0";
  if (!["title-asc", "title-desc", "added-desc", "added-asc", "updated-desc", "rating-desc", "year-desc", "platform-asc"].includes(state.sort)) state.sort = "title-asc";
  if (!["grid", "list"].includes(state.view)) state.view = "grid";
  if (state.completion !== "" && (Number(state.completion) < 0 || Number(state.completion) > 100)) state.completion = "";
  if (state.year !== "" && (Number(state.year) < 1950 || Number(state.year) > CURRENT_YEAR + 5)) state.year = "";
}

function resetFilters(includeSearch) {
  if (includeSearch) state.query = "";
  state.platform = "all";
  state.status = "all";
  state.ownership = "all";
  state.format = "all";
  state.favorite = "all";
  state.rating = "0";
  state.completion = "";
  state.year = "";
  state.tag = "all";
  state.page = 1;
  render();
}

function renderCatalog() {
  const query = normalizeText($("#catalog-search").value);
  const platform = $("#catalog-platform").value;
  const results = catalogSeed.filter(function (game) {
    return (platform === "all" || game.platform === platform) && normalizeText([game.title, game.platform, game.genre, game.year].join(" ")).includes(query);
  });
  $("#catalog-count").textContent = results.length + " of " + catalogSeed.length + " games";
  const activeKeys = new Set(games.filter(function (game) { return !game.deletedAt; }).map(function (game) { return normalizeText(game.title + "|" + gamePlatform(game)); }));
  $("#catalog-grid").innerHTML = results.map(function (game) {
    const added = activeKeys.has(normalizeText(game.title + "|" + game.platform));
    return "<article class=\"catalog-card\"><div class=\"cover " + escapeHtml(game.color) + "\" aria-hidden=\"true\">" + escapeHtml(game.title.charAt(0)) + "</div><h3>" + escapeHtml(game.title) + "</h3><p>" + escapeHtml(game.platform) + " · " + escapeHtml(game.genre) + " · " + game.year + "</p><button class=\"button " + (added ? "added" : "") + "\" data-catalog-id=\"" + escapeHtml(game.id) + "\" " + (added ? "disabled" : "") + ">" + (added ? "In your library" : "Add to backlog") + "</button></article>";
  }).join("") || "<p class=\"catalog-empty\">No catalog games match that search. Try “Can’t find your game?” to add it manually.</p>";
}

function populateCatalogPlatforms() {
  const platforms = Array.from(new Set(catalogSeed.map(function (game) { return game.platform; }))).sort();
  $("#catalog-platform").innerHTML = "<option value=\"all\">All platforms</option>" + platforms.map(function (platform) { return "<option>" + escapeHtml(platform) + "</option>"; }).join("");
}

function openCatalog() {
  renderCatalog();
  $("#catalog-dialog").showModal();
  requestAnimationFrame(function () { $("#catalog-search").focus(); });
}

function resetEntryForm() {
  $("#entry-form").reset();
  $("#entry-form [name='id']").value = "";
  $("#entry-form [name='status']").value = "backlog";
  $("#entry-form [name='ownership']").value = "owned";
  $("#entry-form [name='format']").value = "unknown";
  $("#entry-form [name='currency']").value = "USD";
  $("#error-summary").hidden = true;
  $("#duplicate-warning").hidden = true;
  $("#custom-platform-wrap").hidden = true;
  $("#entry-form [name='customPlatform']").required = false;
  $(".optional-fields").open = false;
  editingId = null;
  duplicateAllowed = false;
}

function openEntry(game) {
  resetEntryForm();
  $("#catalog-dialog").close();
  if (game) {
    editingId = game.id;
    $("#entry-kicker").textContent = "Edit entry";
    $("#entry-heading").textContent = "Edit " + game.title;
    Object.keys(game).forEach(function (key) {
      const field = $("#entry-form [name='" + key + "']");
      if (!field) return;
      if (field.type === "checkbox") field.checked = Boolean(game[key]);
      else field.value = game[key] == null ? "" : (Array.isArray(game[key]) ? game[key].join(", ") : game[key]);
    });
    $("#entry-form [name='id']").value = game.id;
    if (game.purchaseDate || game.acquiredFrom || game.purchasePrice != null || game.startedOn || game.completedOn || game.notes) $(".optional-fields").open = true;
  } else {
    $("#entry-kicker").textContent = "New entry";
    $("#entry-heading").textContent = "Add a game";
  }
  updateCustomPlatform();
  $("#entry-dialog").showModal();
  requestAnimationFrame(function () { $("#entry-form [name='title']").focus(); });
}

function updateCustomPlatform() {
  const isOther = $("#entry-form [name='platform']").value === "Other";
  $("#custom-platform-wrap").hidden = !isOther;
  $("#entry-form [name='customPlatform']").required = isOther;
}

function readEntryForm() {
  const form = new FormData($("#entry-form"));
  const nullableNumber = function (name) { return form.get(name) === "" ? null : Number(form.get(name)); };
  return {
    title: String(form.get("title") || "").trim(),
    platform: String(form.get("platform") || ""),
    customPlatform: String(form.get("customPlatform") || "").trim(),
    edition: String(form.get("edition") || "").trim(),
    releaseYear: nullableNumber("releaseYear"),
    status: form.get("status"),
    ownership: form.get("ownership"),
    format: form.get("format"),
    rating: nullableNumber("rating"),
    completionPercent: nullableNumber("completionPercent"),
    hoursPlayed: nullableNumber("hoursPlayed"),
    favorite: form.get("favorite") === "on",
    tags: String(form.get("tags") || "").split(",").map(function (tag) { return tag.trim(); }).filter(Boolean).filter(function (tag, index, all) { return all.findIndex(function (other) { return normalizeText(other) === normalizeText(tag); }) === index; }),
    purchaseDate: form.get("purchaseDate") || "",
    acquiredFrom: String(form.get("acquiredFrom") || "").trim(),
    purchasePrice: nullableNumber("purchasePrice"),
    currency: form.get("currency") || "USD",
    startedOn: form.get("startedOn") || "",
    completedOn: form.get("completedOn") || "",
    notes: String(form.get("notes") || "")
  };
}

function validateEntry(entry) {
  const errors = [];
  if (!entry.title) errors.push(["title", "Enter a title."]);
  if (entry.title.length > 200) errors.push(["title", "Title must be 200 characters or fewer."]);
  if (!entry.platform) errors.push(["platform", "Choose a platform."]);
  if (entry.platform === "Other" && !entry.customPlatform) errors.push(["customPlatform", "Enter the custom platform name."]);
  if (entry.releaseYear != null && (entry.releaseYear < 1950 || entry.releaseYear > CURRENT_YEAR + 5)) errors.push(["releaseYear", "Release year must be between 1950 and " + (CURRENT_YEAR + 5) + "."]);
  if (entry.completionPercent != null && (entry.completionPercent < 0 || entry.completionPercent > 100)) errors.push(["completionPercent", "Completion must be between 0 and 100."]);
  if (entry.hoursPlayed != null && (entry.hoursPlayed < 0 || entry.hoursPlayed > 999999.9)) errors.push(["hoursPlayed", "Hours played must be between 0 and 999999.9."]);
  if (entry.purchasePrice != null && entry.purchasePrice < 0) errors.push(["purchasePrice", "Purchase price cannot be negative."]);
  if (entry.completedOn && entry.startedOn && entry.completedOn < entry.startedOn) errors.push(["completedOn", "Completion date cannot be before the start date."]);
  if (entry.tags.length > 20) errors.push(["tags", "Use no more than 20 tags."]);
  if (entry.tags.some(function (tag) { return tag.length > 40; })) errors.push(["tags", "Each tag must be 40 characters or fewer."]);
  return errors;
}

function showErrors(errors) {
  $("#error-list").innerHTML = errors.map(function (error) { return "<li><a href=\"#\" data-error-field=\"" + escapeHtml(error[0]) + "\">" + escapeHtml(error[1]) + "</a></li>"; }).join("");
  $("#error-summary").hidden = false;
  $("#error-summary").focus();
}

function saveEntry(event) {
  event.preventDefault();
  const entry = readEntryForm();
  const errors = validateEntry(entry);
  if (errors.length) { showErrors(errors); return; }
  $("#error-summary").hidden = true;

  const duplicate = games.find(function (game) {
    return !game.deletedAt && String(game.id) !== String(editingId) && normalizeText(game.title) === normalizeText(entry.title) && normalizeText(gamePlatform(game)) === normalizeText(entry.platform === "Other" ? entry.customPlatform : entry.platform) && normalizeText(game.edition) === normalizeText(entry.edition);
  });
  if (duplicate && !duplicateAllowed) {
    $("#duplicate-copy").textContent = duplicate.title + " on " + gamePlatform(duplicate) + " is already in your library. You can still save another copy.";
    $("#duplicate-warning").hidden = false;
    $("#duplicate-warning").scrollIntoView({ block: "nearest" });
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const futureDates = [entry.purchaseDate, entry.startedOn, entry.completedOn].filter(function (date) { return date && date > today; });
  if (futureDates.length && !window.confirm("One or more dates are in the future. Save them as entered?")) return;

  if (editingId) {
    const index = games.findIndex(function (game) { return String(game.id) === String(editingId); });
    const existing = games[index];
    games[index] = Object.assign({}, existing, entry, { updatedAt: nowIso(), version: existing.version + 1 });
  } else {
    games.push(Object.assign({}, entry, { id: "game-" + Date.now(), color: COLOR_NAMES[games.length % COLOR_NAMES.length], createdAt: nowIso(), updatedAt: nowIso(), deletedAt: "", version: 1 }));
  }
  if (!saveGames()) return;
  $("#entry-dialog").close();
  populateLibraryFacets();
  state.page = 1;
  render();
  notify(editingId ? "Changes saved." : "Game added to your library.");
}

function openDetail(game) {
  detailId = game.id;
  $("#detail-title").textContent = game.title;
  $("#detail-subtitle").textContent = gamePlatform(game) + (game.edition ? " · " + game.edition : "");
  const rows = [
    ["Play status", statusLabel(game.status)],
    ["Ownership", ownershipLabel(game.ownership)],
    ["Format", formatLabel(game.format)],
    ["Release year", game.releaseYear],
    ["Rating", game.rating ? stars(game.rating) : ""],
    ["Completion", game.completionPercent == null ? "" : game.completionPercent + "%"],
    ["Hours played", game.hoursPlayed == null ? "" : game.hoursPlayed],
    ["Tags", game.tags.join(", ")],
    ["Purchase date", formatDate(game.purchaseDate)],
    ["Purchase price", game.purchasePrice == null ? "" : new Intl.NumberFormat(undefined, { style: "currency", currency: game.currency || "USD" }).format(game.purchasePrice)],
    ["Acquired from", game.acquiredFrom],
    ["Started", formatDate(game.startedOn)],
    ["Completed", formatDate(game.completedOn)],
    ["Notes", game.notes],
    ["Added", formatDate(game.createdAt)],
    ["Last updated", formatDate(game.updatedAt)]
  ].filter(function (row) { return row[1] !== "" && row[1] != null; });
  $("#detail-content").innerHTML = rows.map(function (row) { return "<div class=\"detail-row\"><dt>" + escapeHtml(row[0]) + "</dt><dd>" + escapeHtml(row[1]) + "</dd></div>"; }).join("");
  $("#detail-dialog").showModal();
}

function askConfirmation(title, copy, buttonLabel, action) {
  $("#confirm-title").textContent = title;
  $("#confirm-copy").textContent = copy;
  $("#confirm-action").textContent = buttonLabel;
  pendingConfirmation = action;
  $("#confirm-dialog").showModal();
}

function moveToTrash(game) {
  game.deletedAt = nowIso();
  game.updatedAt = nowIso();
  game.version += 1;
  saveGames();
  $("#detail-dialog").close();
  render();
  notify(game.title + " moved to trash. It can be restored for 30 days.");
}

function restoreGame(game) {
  const duplicate = games.find(function (candidate) {
    return !candidate.deletedAt && candidate.id !== game.id && normalizeText(candidate.title) === normalizeText(game.title) && normalizeText(gamePlatform(candidate)) === normalizeText(gamePlatform(game));
  });
  if (duplicate && !window.confirm("A similar active entry already exists. Restore this copy anyway?")) return;
  game.deletedAt = "";
  game.updatedAt = nowIso();
  game.version += 1;
  saveGames();
  render();
  notify(game.title + " restored.");
}

function permanentlyDelete(game) {
  games = games.filter(function (candidate) { return candidate.id !== game.id; });
  saveGames();
  render();
  notify(game.title + " was permanently deleted.");
}

function downloadFile(filename, type, content) {
  const blob = new Blob([content], { type: type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}

function csvCell(value) {
  let text = Array.isArray(value) ? JSON.stringify(value) : String(value == null ? "" : value);
  if (/^[=+\-@\t\r]/.test(text)) text = "'" + text;
  return '"' + text.replace(/"/g, '""') + '"';
}

function exportJson() {
  downloadFile("gameshelf-export-" + new Date().toISOString().slice(0, 10) + ".json", "application/json;charset=utf-8", JSON.stringify({ version: 1, exportedAt: nowIso(), entries: games, preferences: preferences }, null, 2));
  notify("JSON export downloaded.");
}

function exportCsv() {
  const fields = ["title", "platform", "customPlatform", "edition", "releaseYear", "status", "ownership", "format", "rating", "completionPercent", "hoursPlayed", "purchasePrice", "currency", "purchaseDate", "acquiredFrom", "startedOn", "completedOn", "tags", "favorite", "notes", "createdAt", "updatedAt", "deletedAt"];
  const rows = [fields.map(csvCell).join(",")].concat(games.map(function (game) { return fields.map(function (field) { return csvCell(game[field]); }).join(","); }));
  downloadFile("gameshelf-entries-" + new Date().toISOString().slice(0, 10) + ".csv", "text/csv;charset=utf-8", "\uFEFF" + rows.join("\r\n"));
  notify("CSV export downloaded.");
}

function populateSettings() {
  $("#preference-view").value = preferences.view;
  $("#preference-page-size").value = String(preferences.pageSize);
}

function bindFilter(id, stateKey, eventName) {
  $(id).addEventListener(eventName || "change", function (event) {
    state[stateKey] = event.target.value;
    state.page = 1;
    render();
  });
}

bindFilter("#platform-filter", "platform");
bindFilter("#status-filter", "status");
bindFilter("#ownership-filter", "ownership");
bindFilter("#format-filter", "format");
bindFilter("#favorite-filter", "favorite");
bindFilter("#rating-filter", "rating");
bindFilter("#completion-filter", "completion", "input");
bindFilter("#year-filter", "year", "input");
bindFilter("#tag-filter", "tag");
bindFilter("#sort-games", "sort");
$("#search-games").addEventListener("input", function (event) {
  state.query = event.target.value.slice(0, 100);
  state.page = 1;
  $("#clear-search").hidden = !state.query;
  clearTimeout(searchTimer);
  searchTimer = setTimeout(render, 300);
});
$("#clear-search").addEventListener("click", function () { state.query = ""; state.page = 1; render(); $("#search-games").focus(); });
$("#filter-toggle").addEventListener("click", function () {
  const panel = $("#filter-panel");
  panel.hidden = !panel.hidden;
  this.setAttribute("aria-expanded", String(!panel.hidden));
});
$("#clear-filters").addEventListener("click", function () { resetFilters(false); });
$("#filter-chips").addEventListener("click", function (event) {
  const button = event.target.closest("[data-clear-filter]");
  if (!button) return;
  const key = button.dataset.clearFilter;
  state[key] = ["rating"].includes(key) ? "0" : (["completion", "year"].includes(key) ? "" : "all");
  state.page = 1;
  render();
});
$("#empty-clear").addEventListener("click", function () { resetFilters(true); });
$("#toggle-view").addEventListener("click", function () {
  state.view = state.view === "grid" ? "list" : "grid";
  preferences.view = state.view;
  savePreferences();
  render();
});
$("#page-size").addEventListener("change", function (event) {
  state.pageSize = Number(event.target.value);
  state.page = 1;
  preferences.pageSize = state.pageSize;
  savePreferences();
  render();
});
$("#pagination").addEventListener("click", function (event) {
  const button = event.target.closest("[data-page]");
  if (!button || button.disabled) return;
  state.page = Number(button.dataset.page);
  render();
  $("#library-results").focus({ preventScroll: true });
  window.scrollTo({ top: $("#library-results").offsetTop - 20, behavior: "smooth" });
});
$("#show-trash").addEventListener("click", function () { state.trash = !state.trash; state.page = 1; render(); });

$("#library-results").addEventListener("click", function (event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const game = games.find(function (item) { return String(item.id) === String(button.dataset.id); });
  if (!game) return;
  const action = button.dataset.action;
  if (action === "favorite") { game.favorite = !game.favorite; game.updatedAt = nowIso(); game.version += 1; saveGames(); render(); notify(game.favorite ? "Added to favorites." : "Removed from favorites."); }
  if (action === "details") openDetail(game);
  if (action === "edit") openEntry(game);
  if (action === "trash") askConfirmation("Move to trash?", "Move " + game.title + " on " + gamePlatform(game) + " to trash? It will remain recoverable for 30 days.", "Move to trash", function () { moveToTrash(game); });
  if (action === "restore") restoreGame(game);
  if (action === "delete") askConfirmation("Delete permanently?", "Permanently delete " + game.title + "? This cannot be undone.", "Delete forever", function () { permanentlyDelete(game); });
});

$("#open-add").addEventListener("click", openCatalog);
$("#empty-add").addEventListener("click", openCatalog);
$("#close-catalog").addEventListener("click", function () { $("#catalog-dialog").close(); });
$("#catalog-search").addEventListener("input", renderCatalog);
$("#catalog-platform").addEventListener("change", renderCatalog);
$("#manual-add").addEventListener("click", function () { openEntry(null); });
$("#catalog-grid").addEventListener("click", function (event) {
  const button = event.target.closest("[data-catalog-id]");
  if (!button) return;
  const source = catalogSeed.find(function (game) { return game.id === button.dataset.catalogId; });
  if (!source) return;
  games.push(normalizeGame({ id: "game-" + Date.now(), title: source.title, platform: source.platform, releaseYear: source.year, status: "backlog", ownership: "owned", format: "unknown", tags: [source.genre.toLowerCase()], color: source.color, createdAt: nowIso(), updatedAt: nowIso() }, games.length));
  saveGames();
  $("#catalog-dialog").close();
  state.trash = false;
  state.page = 1;
  render();
  notify(source.title + " added to your backlog.");
});

$("#entry-form [name='platform']").addEventListener("change", updateCustomPlatform);
$("#entry-form").addEventListener("submit", saveEntry);
$("#close-entry").addEventListener("click", function () { $("#entry-dialog").close(); });
$("#cancel-entry").addEventListener("click", function () { $("#entry-dialog").close(); });
$("#save-duplicate").addEventListener("click", function () { duplicateAllowed = true; $("#entry-form").requestSubmit(); });
$("#error-list").addEventListener("click", function (event) {
  const link = event.target.closest("[data-error-field]");
  if (!link) return;
  event.preventDefault();
  const field = $("#entry-form [name='" + link.dataset.errorField + "']");
  if (field) field.focus();
});

$("#close-detail").addEventListener("click", function () { $("#detail-dialog").close(); });
$("#detail-edit").addEventListener("click", function () {
  const game = games.find(function (item) { return item.id === detailId; });
  $("#detail-dialog").close();
  if (game) openEntry(game);
});
$("#detail-trash").addEventListener("click", function () {
  const game = games.find(function (item) { return item.id === detailId; });
  $("#detail-dialog").close();
  if (game) askConfirmation("Move to trash?", "Move " + game.title + " to trash? It will remain recoverable for 30 days.", "Move to trash", function () { moveToTrash(game); });
});

$("#confirm-action").addEventListener("click", function () {
  const action = pendingConfirmation;
  pendingConfirmation = null;
  if (action) action();
});

$("#open-settings").addEventListener("click", function () { populateSettings(); $("#settings-dialog").showModal(); });
$("#close-settings").addEventListener("click", function () { $("#settings-dialog").close(); });
$("#save-preferences").addEventListener("click", function () {
  preferences.view = $("#preference-view").value;
  preferences.pageSize = Number($("#preference-page-size").value);
  state.view = preferences.view;
  state.pageSize = preferences.pageSize;
  state.page = 1;
  savePreferences();
  render();
  notify("Preferences saved.");
});
$("#export-json").addEventListener("click", exportJson);
$("#export-csv").addEventListener("click", exportCsv);
$("#reset-library").addEventListener("click", function () {
  $("#settings-dialog").close();
  askConfirmation("Reset local data?", "Erase this browser's saved library and restore the six starter games? Export first if you want a copy.", "Reset data", function () {
    games = starterGames.map(normalizeGame);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    saveGames();
    state.trash = false;
    resetFilters(true);
    notify("Local library reset.");
  });
});

window.addEventListener("popstate", function () { applyUrlState(); render(); });

applyUrlState();
populateCatalogPlatforms();
render();
