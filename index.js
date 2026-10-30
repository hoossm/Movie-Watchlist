const API_KEY = "af783e84";

const form = document.getElementById("search");
const input = document.getElementById("search-input");
const explore = document.getElementById("explore");
const message = document.getElementById("message");
const loader = document.getElementById("loader");
const result = document.getElementById("result");


// Show one section and hide the other two
function show(section) {
    explore.className = section === "explore" ? "explore" : "disabled";
    loader.className = section === "loader" ? "loader" : "disabled";
    result.className = section === "result" ? "result" : "disabled";
}

// Put the error text in the "Start exploring" message and show that section
function showError(text) {
    message.textContent = text;
    show("explore");
}


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const query = input.value.trim();
    input.value = "";

    // Empty search: back to the explore section with an error
    if (!query) {
        showError("Please type a movie name to search.");
        return;
    }

    // Hide explore and the old results, show the loader
    show("loader");

    try {
        const movies = await getMovies(query);

        if (movies.length === 0) {
            showError("Unable to find what you’re looking for. Please try another search.");
            return;
        }

        movieHtml(movies);   // fills #result
        show("result");      // loader is hidden only now, when everything is ready
    } catch (err) {
        console.error(err);
        showError("Something went wrong. Please try again.");
    }
});


async function getMovies(movieName) {
    const res = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&type=movie&s=${encodeURIComponent(movieName)}`
    );
    const data = await res.json();

    // OMDb answers { Response: "False", Error: "..." } and has no data.Search
    if (data.Response === "False") {
        console.warn(data.Error);
        return [];
    }

    // Fetch every movie's details at the same time
    return Promise.all(
        data.Search.map(async (movie) => {
            const res = await fetch(
                `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
            );
            return res.json();
        })
    );
}


function movieHtml(data) {
    result.innerHTML = data.map((movie) => {
        const poster = movie.Poster !== "N/A" ? movie.Poster : "images/hero.png";

        return `
            <div class="moive-box container">
                <img class="movie-image" src="${escapeHtml(poster)}" alt="Poster of ${escapeHtml(movie.Title)}">
                <div class="movie-info">
                    <div class="movie">
                        <h2>${escapeHtml(movie.Title)}</h2>
                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M4.86276 0.518241C5.08727 -0.172742 6.06483 -0.172743 6.28934 0.51824L7.09152 2.98709C7.19193 3.2961 7.47989 3.50532 7.80481 3.50532H10.4007C11.1273 3.50532 11.4293 4.43504 10.8416 4.86209L8.74142 6.38792C8.47856 6.5789 8.36856 6.91743 8.46897 7.22644L9.27115 9.69529C9.49566 10.3863 8.7048 10.9609 8.11702 10.5338L6.01689 9.00799C5.75402 8.817 5.39808 8.817 5.13521 9.00799L3.03508 10.5338C2.4473 10.9609 1.65644 10.3863 1.88095 9.69529L2.68313 7.22645C2.78354 6.91743 2.67354 6.5789 2.41068 6.38792L0.31055 4.86209C-0.277235 4.43504 0.0248458 3.50532 0.751388 3.50532H3.34729C3.67221 3.50532 3.96017 3.2961 4.06058 2.98709L4.86276 0.518241Z" fill="#FEC654" />
                        </svg>
                        <p class="mini-text">${escapeHtml(movie.imdbRating)}</p>
                    </div>
                    <div class="tags">
                        <p class="mini-text">${escapeHtml(movie.Runtime)}</p>
                        <p class="mini-text">${escapeHtml(movie.Genre)}</p>
                        <button class="watchlist-btn" data-id="${escapeHtml(movie.imdbID)}">
                            <svg class="add-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM9 5C9 4.44772 8.55228 4 8 4C7.44772 4 7 4.44772 7 5V7H5C4.44772 7 4 7.44771 4 8C4 8.55228 4.44772 9 5 9H7V11C7 11.5523 7.44772 12 8 12C8.55228 12 9 11.5523 9 11V9H11C11.5523 9 12 8.55228 12 8C12 7.44772 11.5523 7 11 7H9V5Z" fill-rule="evenodd" clip-rule="evenodd" fill="white" />
                            </svg>
                            Watchlist
                        </button>
                    </div>
                    <p class="description">${escapeHtml(movie.Plot)}</p>
                </div>
            </div>
        `;
    }).join("");
}


// OMDb content is written by its users, so never put it into innerHTML raw
function escapeHtml(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

