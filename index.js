
const form = document.getElementById("search");
const input = document.getElementById("search-input");



form.addEventListener("submit", (e) => {
    e.preventDefault();

    const query = input.value.trim();
    if (!query) return;

    getMovies(query)
        .then(res => console.log(res))

    input.value = "";



});


async function getMovies(movieName) {
    const res = await fetch(`https://www.omdbapi.com/?apikey=af783e84&s=${movieName}`)
    const data = await res.json()
    const ids = data.Search.map(movie => movie.imdbID)
    const result = []
    for (const movieID of ids) {
        const res = await fetch(`https://www.omdbapi.com/?apikey=af783e84&i=${movieID}`)
        const data = await res.json()
        result.push(data)

    }
    return result
}




// {
// Title: 'Blade Runner',
// Year: '1982',
// imdbID: 'tt0083658',
// Type: 'movie',
// Poster: 'https://m.media-amazon.com/images/M/MV5BOWQ4YTBmNT…zUxXkEyXkFqcGc@._V1_QL75_UX380_CR0,2,380,562_.jpg'
// }

// {
//     "Title": "Blade Runner",
//     "Year": "1982",
//     "Rated": "R",
//     "Released": "25 Jun 1982",
//     "Runtime": "117 min",
//     "Genre": "Action, Drama, Sci-Fi",
//     "Director": "Ridley Scott",
//     "Writer": "Hampton Fancher, David Webb Peoples, Philip K. Dick",
//     "Actors": "Harrison Ford, Rutger Hauer, Sean Young",
//     "Plot": "A blade runner must pursue and terminate four replicants who stole a ship in space and have returned to Earth to find their creator.",
//     "Language": "English, German, Cantonese, Japanese, Hungarian, Arabic, Korean",
//     "Country": "United States, United Kingdom, Hong Kong",
//     "Awards": "Nominated for 2 Oscars. 16 wins & 22 nominations total",
//     "Poster": "https://m.media-amazon.com/images/M/MV5BOWQ4YTBmNTQtMDYxMC00NGFjLTkwOGQtNzdhNmY1Nzc1MzUxXkEyXkFqcGc@._V1_QL75_UX380_CR0,2,380,562_.jpg",
//     "Ratings": [
//         {
//             "Source": "Internet Movie Database",
//             "Value": "8.1/10"
//         },
//         {
//             "Source": "Rotten Tomatoes",
//             "Value": "89%"
//         },
//         {
//             "Source": "Metacritic",
//             "Value": "84/100"
//         }
//     ],
//     "Metascore": "84",
//     "imdbRating": "8.1",
//     "imdbVotes": "893,169",
//     "imdbID": "tt0083658",
//     "Type": "movie",
//     "DVD": "N/A",
//     "BoxOffice": "$32,914,489",
//     "Production": "N/A",
//     "Website": "N/A",
//     "Response": "True"
// }