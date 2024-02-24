const appElement = document.getElementById('app');
let planetsData = [];
let currentPage = 1;


async function fetchAndRenderPlanets() {
    const data = await fetchPlanets(currentPage);
    planetsData = data.results;
    //console.log(data.results);
    renderPlanets(planetsData);
    
    renderPagination(data.next);
}


async function fetchPlanets(page) {
    const response = await fetch(`https://swapi.dev/api/planets/?format=json&page=${page}`);
    const data = await response.json();
    return data;
}

function renderPlanets(planets) {
    appElement.innerHTML = '';
    planets.forEach(planet => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        card.innerHTML = `
            <h2>${planet.name}</h2>
            <p>Climate: ${planet.climate}</p>
            <p>Population: ${planet.population}</p>
            <p>Terrain: ${planet.terrain}</p>
            <p>Gravity: ${planet.gravity}</p>
            <h3>Residents Info of the Planet ${planet.name}</h3>
            <div class="residents" id="residents-${planet.name}"></div>
            
        `;
        appElement.appendChild(card);

        const residentsElement = document.getElementById(`residents-${planet.name}`);
        fetchResidents(planet.residents, residentsElement);
    });
}

async function fetchResidents(residentsUrls, residentsElement) {
   
    
    for (const url of residentsUrls) {
        const response = await fetch(url);
        const resident = await response.json();
       
    
        const residentInfo = document.createElement('p');
        residentInfo.textContent = `${resident.name} | Height: ${resident.height} | Mass: ${resident.mass} | Gender: ${resident.gender} | BirthYear: ${resident.birth_year} | EyeColor: ${resident.eye_color}`;
        residentsElement.appendChild(residentInfo);
    }
}

function renderPagination(nextPage) {
    const paginationElement = document.createElement('div');
    paginationElement.classList.add('pagination');

    if (currentPage > 1) {
        const prevPageLink = createPageLink('Prev', currentPage - 1);
        paginationElement.appendChild(prevPageLink);
    }

    if (nextPage) {
        const nextPageLink = createPageLink('Next', currentPage + 1);
        paginationElement.appendChild(nextPageLink);
    }

    appElement.appendChild(paginationElement);
}

function createPageLink(text, page) {
    const pageLink = document.createElement('a');
    pageLink.classList.add('page-link');
    pageLink.textContent = text;
    pageLink.href = '#';
    pageLink.addEventListener('click', () => handlePageChange(page));
    return pageLink;
}

function handlePageChange(page) {
    currentPage = page;
    fetchAndRenderPlanets();
}

// Initial load
fetchAndRenderPlanets();
