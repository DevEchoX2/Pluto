// your code goes here// Config: add your games here
const GAMES = [
  {
    id: "slope",
    title: "Slope",
    url: "https://devechox2.github.io/Geminal/games/slope.html",
    tags: ["arcade", "retro"],
    thumb: "SLOPE"
  }, 
  {
    id: "2048",
    title: "2048",
    url: "https://devechox2.github.io/Geminal/games/2048.html",
    tags: ["arcade", "puzzle"],
    thumb: "2048"
  },
  {
    id: "Aquapark-io",
    title: "AquaPark",
    url: "https://devechox2.github.io/Geminal/games/aquaparkio.html",
    tags: ["arcade", "sport"],
    thumb: "aqua park"
  },
  {
    id: "basketball-stars",
    title: "Basketball Stars",
    url: "https://devechox2.github.io/Geminal/games/basketballstars.html",
    tags: ["sport", "arcade"],
    thumb: "BBALL"
  },
  {
    id: "capybara-clicker",
    title: "Capybara Clicker",
    url: "hhttps://devechox2.github.io/Geminal/games/capybaraclicker.html",
    tags: ["idle", "arcade"],
    thumb: "Capybara"
  },
  {
    id: "tetris",
    title: "Tetris",
    url: "https://devechox2.github.io/Geminal/games/tetrisgba.html",
    tags: ["puzzle", "retro"],
    thumb: "TETRIS"
  },
];

// State
let filter = "all";
let search = "";
let selectedGame = null;

// Elements
const grid = document.getElementById("gameGrid");
const chips = document.querySelectorAll(".chip");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const player = document.getElementById("player");
const playerFrame = document.getElementById("playerFrame");
const playerTitle = document.getElementById("playerTitle");
const favoriteBtn = document.getElementById("favoriteBtn");
const openNewTab = document.getElementById("openNewTab");
const closePlayer = document.getElementById("closePlayer");
const toggleTheme = document.getElementById("toggleTheme");
const aboutModal = document.getElementById("aboutModal");
const openAbout = document.getElementById("openAbout");
const closeAbout = document.getElementById("closeAbout");

// Local storage helpers
const FAVORITES_KEY = "geminal:favorites";
const THEME_KEY = "geminal:theme";
const getFavs = () => JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
const setFavs = (arr) => localStorage.setItem(FAVORITES_KEY, JSON.stringify(arr));
const isFav = (id) => getFavs().includes(id);
const toggleFav = (id) => {
  const favs = new Set(getFavs());
  favs.has(id) ? favs.delete(id) : favs.add(id);
  setFavs([...favs]);
};

// Theme toggle (optional light)
const applyTheme = () => {
  const theme = localStorage.getItem(THEME_KEY) || "neon";
  document.documentElement.dataset.theme = theme;
};
toggleTheme.addEventListener("click", () => {
  const current = localStorage.getItem(THEME_KEY) || "neon";
  const next = current === "neon" ? "neon" : "neon"; // placeholder for future theme variants
  localStorage.setItem(THEME_KEY, next);
  applyTheme();
});

// Filters
chips.forEach(chip => {
  chip.addEventListener("click", () => {
    chips.forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    filter = chip.dataset.filter;
    renderGrid();
  });
});

// Search
searchInput.addEventListener("input", (e) => {
  search = e.target.value.toLowerCase().trim();
  renderGrid();
});
clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  search = "";
  renderGrid();
});

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === "k") {
    e.preventDefault();
    searchInput.focus();
  }
  if (e.key === "Escape") closeDrawer();
  if (e.key.toLowerCase() === "f" && selectedGame) {
    e.preventDefault();
    favoriteBtn.click();
  }
  if (e.key === "Enter") {
    const first = grid.querySelector(".card");
    if (first) first.click();
  }
});

// Render grid
function renderGrid() {
  const favs = getFavs();
  const list = GAMES.filter(g => {
    const matchesFilter =
      filter === "all" ? true :
      filter === "favorites" ? favs.includes(g.id) :
      g.tags.includes(filter);
    const matchesSearch =
      !search ||
      g.title.toLowerCase().includes(search) ||
      g.tags.join(" ").toLowerCase().includes(search);
    return matchesFilter && matchesSearch;
  });

  grid.innerHTML = "";
  if (list.length === 0) {
    grid.innerHTML = `<div class="empty">No games found. Try another filter or search.</div>`;
    return;
  }

  list.forEach(g => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="thumb">${g.thumb}</div>
      <div class="meta">
        <div class="title">${g.title}</div>
        <div class="tags">${g.tags.join(" • ")}</div>
        <div class="tags">${isFav(g.id) ? "★ Favorited" : "&nbsp;"}</div>
      </div>
    `;
    card.addEventListener("click", () => openGame(g));
    grid.appendChild(card);
  });
}

// Open game
function openGame(game) {
  selectedGame = game;
  playerTitle.textContent = game.title;
  playerFrame.src = game.url;
  player.classList.add("open");
  favoriteBtn.dataset.id = game.id;
}

// Player actions
favoriteBtn.addEventListener("click", () => {
  const id = favoriteBtn.dataset.id;
  if (!id) return;
  toggleFav(id);
  renderGrid();
});
openNewTab.addEventListener("click", () => {
  if (selectedGame) window.open(selectedGame.url, "_blank", "noopener");
});
closePlayer.addEventListener("click", closeDrawer);
function closeDrawer() {
  player.classList.remove("open");
  playerFrame.src = "about:blank";
  selectedGame = null;
}

// About
openAbout.addEventListener("click", () => aboutModal.showModal());
closeAbout.addEventListener("click", () => aboutModal.close());

// Init
applyTheme();
renderGrid();

