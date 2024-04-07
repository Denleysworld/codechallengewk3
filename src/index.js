
document.addEventListener("DOMContentLoaded", function() {
    const movieList = document.getElementById("films");

    // Function to load and show movie list
    function showMovies() {
        // Fetch the list of movies from the theater's website
        fetch("http://localhost:3000/films")
        .then(response => response.json())
        .then(data => {
            // Display each movie in a list on the website
            data.forEach(movie => {
                const listItem = document.createElement("li");
                listItem.textContent = movie.title;
                listItem.classList.add("film", "item");
                listItem.dataset.id = movie.id;
                // Add a "Sold Out" label if the movie is full
                if (movie.tickets_sold === movie.capacity) {
                    listItem.classList.add("sold-out");
                    listItem.textContent += " (Sold Out)";
                }
                // Show details when a movie is clicked
                listItem.addEventListener("click", function() {
                    const poster = document.getElementById("poster");
                    const description = document.getElementById("film-info");
                    const title = document.getElementById("title");
                    const runtime = document.getElementById("runtime");
                    const showtime = document.getElementById("showtime");
                    
                    poster.src = movie.poster;
                    description.textContent = movie.description;
                    title.textContent = movie.title;
                    runtime.textContent = movie.runtime + " minutes";
                    showtime.textContent = movie.showtime;
                });
                movieList.appendChild(listItem);
            });
        })
        .catch(error => console.error("Oops! Something went wrong while loading movies:", error));
    }

    // Function to handle ticket purchase
    function buyTicket(movieId) {
        // Fetch the movie's details to check available tickets
        fetch(`http://localhost:3000/films/${movieId}`)
        .then(response => response.json())
        .then(movie => {
            // If tickets are available, let the user buy one
            if (movie.tickets_sold < movie.capacity) {
                const newTicketsSold = movie.tickets_sold + 1;
                // Update the ticket count on the website
                fetch(`http://localhost:3000/films/${movieId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ tickets_sold: newTicketsSold })
                })
                .then(response => response.json())
                .then(updatedMovie => {
                    // Update movie list to show "Sold Out" if necessary
                    const listItem = document.querySelector(`li[data-id="${movieId}"]`);
                    if (updatedMovie.tickets_sold === updatedMovie.capacity) {
                        listItem.classList.add("sold-out");
                        listItem.textContent += " (Sold Out)";
                    }
                })
                .catch(error => console.error("Oops! Something went wrong while buying a ticket:", error));
            } else {
                // Alert the user if the movie is sold out
                alert("Sorry, all tickets for this movie are sold out!");
            }
        })
        .catch(error => console.error("Oops! Something went wrong while fetching movie details:", error));
    }

    // Event listener for buying tickets when a movie is clicked
    movieList.addEventListener("click", function(event) {
        if (event.target && event.target.matches("li.film.item")) {
            const movieId = event.target.dataset.id;
            buyTicket(movieId);
        }
    });

    // Remove the placeholder item from the movie list
    const placeholderItem = document.getElementById("placeholder");
    if (placeholderItem) {
        placeholderItem.remove();
    }

    // show the movie list when the page loads
    showMovies();
});
