document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.querySelector('.search-btn');
    const clearBtn = document.querySelector('.clear-btn');
    const searchInput = document.querySelector('.search-input');

    // Create or locate a container for search results
    let resultsContainer = document.querySelector('.search-results-container');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results-container';
        // Append it inside the hero section or content area
        const heroContent = document.querySelector('.hero-content');
        heroContent.appendChild(resultsContainer);
    }

    // Function to fetch data from the provided JSON file
    function fetchTravelRecommendations(query) {
        fetch('travel_recommendation_api.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                processAndDisplayResults(data, query);
            })
            .catch(error => {
                console.error('Error fetching travel data:', error);
            });
    }

    // Function to filter and display search results based on JSON structure[cite: 5]
    function processAndDisplayResults(data, query) {
        resultsContainer.innerHTML = '';
        const searchTerm = query.toLowerCase().trim();

        if (!searchTerm) {
            resultsContainer.style.display = 'none';
            return;
        }

        let matches = [];

        // Check for keyword "beach" or "beaches"
        if (searchTerm.includes('beach')) {
            matches = matches.concat(data.beaches.map(b => ({
                name: b.name,
                description: b.description,
                imageUrl: b.imageUrl
            })));
        }

        // Check for keyword "temple" or "temples"
        if (searchTerm.includes('temple')) {
            matches = matches.concat(data.temples.map(t => ({
                name: t.name,
                description: t.description,
                imageUrl: t.imageUrl
            })));
        }

        // Check countries and their cities[cite: 5]
        data.countries.forEach(country => {
            if (country.name.toLowerCase().includes(searchTerm) || searchTerm.includes('country')) {
                country.cities.forEach(city => {
                    matches.push({
                        name: city.name,
                        description: city.description,
                        imageUrl: city.imageUrl
                    });
                });
            } else {
                // Check individual cities or descriptions
                country.cities.forEach(city => {
                    if (city.name.toLowerCase().includes(searchTerm) || city.description.toLowerCase().includes(searchTerm)) {
                        matches.push({
                            name: city.name,
                            description: city.description,
                            imageUrl: city.imageUrl
                        });
                    }
                });
            }
        });

        // Also check specific temples or beaches by name if not already included
        data.temples.forEach(temple => {
            if (temple.name.toLowerCase().includes(searchTerm) || temple.description.toLowerCase().includes(searchTerm)) {
                if (!matches.some(m => m.name === temple.name)) {
                    matches.push({
                        name: temple.name,
                        description: temple.description,
                        imageUrl: temple.imageUrl
                    });
                }
            }
        });

        data.beaches.forEach(beach => {
            if (beach.name.toLowerCase().includes(searchTerm) || beach.description.toLowerCase().includes(searchTerm)) {
                if (!matches.some(m => m.name === beach.name)) {
                    matches.push({
                        name: beach.name,
                        description: beach.description,
                        imageUrl: beach.imageUrl
                    });
                }
            }
        });

        // Render matching recommendations
        if (matches.length > 0) {
            resultsContainer.style.display = 'flex';
            matches.forEach(item => {
                const card = document.createElement('div');
                card.className = 'recommendation-card';
                card.innerHTML = `
                    <div class="card-content">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <button class="visit-btn">Visit</button>
                    </div>
                `;
                resultsContainer.appendChild(card);
            });
        } else {
            resultsContainer.style.display = 'flex';
            resultsContainer.innerHTML = `<p class="no-results">No destinations found matching "${query}". Try searching for beaches, temples, or countries.</p>`;
        }
    }

    // Event Listener for Search Button
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const query = searchInput.value;
        if (query) {
            fetchTravelRecommendations(query);
        }
    });

    // Event Listener for Clear Button
    clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        searchInput.value = '';
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';
    });
});

// Select the clear button, search input, and results container
const clearBtn = document.querySelector('.clear-btn');
const searchInput = document.querySelector('.search-input');
const resultsContainer = document.querySelector('.search-results-container');

// Event listener for the Clear button
clearBtn.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent any default form behavior
    
    // Clear the text in the search input field
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Clear all the generated recommendation cards and hide the container
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';
    }
});