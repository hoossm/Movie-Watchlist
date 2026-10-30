// Search page. Uses everything from shared.js

const form = document.getElementById("search");
const input = document.getElementById("search-input");


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const query = input.value.trim();
    input.value = "";

    // Empty search: back to the explore section with an error
    if (!query) {
        showError("Please type a movie name to search.");
        return;
    }

    show("loader");

    try {
        const movies = await getMovies(query);

        if (movies.length === 0) {
            showError("Unable to find what you’re looking for. Please try another search.");
            return;
        }

        movieHtml(movies);   // fills #result
        show("result");
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
    const movies = await Promise.all(
        data.Search.map((movie) => getMovieById(movie.imdbID))
    );
    return movies.filter((movie) => movie.Response === "True");
}