document.addEventListener('DOMContentLoaded', function() {
    const baseURL = 'http://localhost:3000';

    // Function to fetch movie details by ID
    function fetchMovieDetails(movieId) {
        return fetch(`${baseURL}/films/${movieId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            });
    }

    // Function to update tickets sold for a movie
    function updateTicketsSold(movieId, newTicketsSold) {
        return fetch(`${baseURL}/films/${movieId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tickets_sold: newTicketsSold
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update tickets sold');
            }
            return response.json();
        });
    }

    // Function to buy a ticket for a movie
    function buyTicket(movieId, currentTicketsSold, capacity) {
        if (currentTicketsSold >= capacity) {
            alert('Sorry, this movie is sold out!');
            return;
        }

        const newTicketsSold = currentTicketsSold + 1;

        // Update tickets sold on the server
        updateTicketsSold(movieId, newTicketsSold)
            .then(() => {
                // Update tickets sold on the frontend
                const availableTickets = capacity - newTicketsSold;
                const availableTicketsElement = document.getElementById(`tickets-${movieId}`);
                if (availableTicketsElement) {
                    availableTicketsElement.textContent = `Available Tickets: ${availableTickets}`;
                }
            })
            .catch(error => {
                console.error('Failed to buy ticket:', error);
            });
    }

    // Function to delete a movie
    function deleteMovie(movieId, listItem) {
        fetch(`${baseURL}/films/${movieId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete movie');
            }
            listItem.remove();
        })
        .catch(error => {
            console.error('Failed to delete movie:', error);
        });
    }

    // Fetch and display the first movie's details
    fetchMovieDetails(1)
        .then(movie => {
            const availableTickets = movie.capacity - movie.tickets_sold;
            console.log('First Movie Details:');
            console.log('Poster:', movie.poster);
            console.log('Title:', movie.title);
            console.log('Runtime:', movie.runtime, 'minutes');
            console.log('Showtime:', movie.showtime);
            console.log('Available Tickets:', availableTickets);
        })
        .catch(error => {
            console.error('Failed to fetch first movie details:', error);
        });

    // Fetch all movies and populate the menu
    fetch(`${baseURL}/films`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(movies => {
            const filmsMenu = document.getElementById('films');
            movies.forEach(movie => {
                const listItem = document.createElement('li');
                listItem.textContent = movie.title;
                listItem.classList.add('film', 'item');

                // Add Buy Ticket button
                const buyTicketButton = document.createElement('button');
                buyTicketButton.textContent = 'Buy Ticket';
                buyTicketButton.addEventListener('click', () => {
                    buyTicket(movie.id, movie.tickets_sold, movie.capacity);
                });
                listItem.appendChild(buyTicketButton);

                // Add Delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => {
                    deleteMovie(movie.id, listItem);
                });
                listItem.appendChild(deleteButton);

                // Add available tickets count
                const availableTickets = movie.capacity - movie.tickets_sold;
                const availableTicketsElement = document.createElement('span');
                availableTicketsElement.textContent = `Available Tickets: ${availableTickets}`;
                availableTicketsElement.id = `tickets-${movie.id}`;
                listItem.appendChild(availableTicketsElement);

                filmsMenu.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Failed to fetch movies:', error);
        });
});

