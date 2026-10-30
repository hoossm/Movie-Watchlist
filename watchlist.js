// Watchlist page. Uses everything from shared.js

loadWatchlist();

async function loadWatchlist() {
    const ids = getWatchlist();

    // Nothing saved: keep the "Your watchlist is looking a little empty..." block
    if (ids.length === 0) {
        show("explore");
        return;
    }

    show("loader");

    try {
        // Request every saved movie from the API using its imdbID
        const movies = await Promise.all(ids.map((id) => getMovieById(id)));
        const valid = movies.filter((movie) => movie.Response === "True");

        if (valid.length === 0) {
            show("explore");
            return;
        }

        movieHtml(valid);   // every button shows "Remove" because the ids are saved
        show("result");
    } catch (err) {
        console.error(err);
        showError("Something went wrong. Please try again.");
    }
}


// shared.js already removed the id from localStorage when "Remove" was clicked.
// Here we also take the card off the page.
result.addEventListener("click", (e) => {
    const button = e.target.closest(".watchlist-btn");
    if (!button) return;

    if (!getWatchlist().includes(button.dataset.id)) {
        button.closest(".moive-box").remove();

        // Last movie removed: show the empty message again
        if (!result.querySelector(".moive-box")) {
            show("explore");
        }
    }
});