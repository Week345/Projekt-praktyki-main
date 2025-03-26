function getData() {
    const url = window.API_URL + 'all';
    const request = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }
    fetch(url, request)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayFilmsInitial(data);
        })
        .catch(error => console.error("Błąd z pobraniem filmu", error))
}

document.addEventListener("DOMContentLoaded", function () {
    getData();
    const menuButton = document.getElementById("menuButton");
    const categoryList = document.getElementById("categoryList");

    menuButton.addEventListener("click", function (event) {
        event.stopPropagation();
        categoryList.style.display = categoryList.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function (event) {
        if (!menuButton.contains(event.target) && !categoryList.contains(event.target)) {
            categoryList.style.display = "none";
        }
    });
});


document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", function() {
        document.querySelectorAll(".dropdown-item").forEach(item => item.style.backgroundColor = "");
        let category = item.textContent;
        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: '{"category":"' + category + '"}'
        };  
        const apiurl = window.API_URL + 'search';
        fetch(apiurl, request)
            .then(response => response.json())
            .then(data => {
                const content = data.content;
                console.log(content);
                sortCategory(content);
            })
            .catch(error => console.error("Błąd z wyświetleniem filmów", error));
        item.style.backgroundColor = "lightgreen";
    });

});

let searchBtn = document.getElementById("lens");
let searchBar = document.getElementById("searchQuery");
searchBtn.addEventListener("click", function() {
    const query = searchBar.value.toLowerCase();
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: '{"searchQuery":"' + query + '"}'
    };  
    const apiurl = window.API_URL + 'search';
    fetch(apiurl, request)
            .then(response => response.json())
            .then(data => {
                const content = data.content;
                console.log(content);
                searchForFilms(query, content);
            })
            .catch(error => console.error("Błąd z wyświetleniem filmów", error));
});

function searchForFilms(query, data) {
    let main = document.getElementById("main");
    main.innerHTML = "";
    if (data.length == 0) {
        let noResult = document.createElement("div");
        noResult.innerHTML = "<h3>Brak wyników zgodnych z wyszukiwaniem</h3>"
        main.appendChild(noResult);
    }
    else {
    data.forEach(dfilm => {
        let title = dfilm.title ? dfilm.title.toLowerCase() : "";
        let description = dfilm.description ? dfilm.description.toLowerCase() : "";
        if (title.includes(query) || description.includes(query)) {
            let main = document.getElementById("main");
            main.innerHTML = "";
            let i = 0;
            data.forEach(film => {
                let category1 = "Brak";
        let category2 = "Brak";
        if (film.categories.length < 2) {
            category1 = film.categories[0].name;
        } else {
            category1 = film.categories[0].name;
            category2 = film.categories[1].name;
        }
        let ratingf = "Brak";
        if (film.rating != null) {
            ratingf = film.rating + '/5';
        }
        let ratingnum = "Brak";
        if (film.ratingsNumber != null) {
            ratingnum = film.ratingsNumber;
        }
        let imdbr = "Brak";
        if (film.imdbrating != null) {
            imdbr = film.imdbrating;
        }


        let filmContainer = document.createElement("div");
        filmContainer.classList.add("film-container");
        
        
        let filmBlock = document.createElement("div");
        filmBlock.classList.add("OddMovies");
        filmBlock.style.display = "flex";
        filmBlock.style.flexDirection = "row";
        filmBlock.style.gap = "20px";

        let filmRating = document.createElement("div");
        filmRating.classList.add("oceny");
        filmRating.innerHTML = `
                <h6 class="text-center">Oceń film</h6>
                <form class ="rating-form" data-film-id = "${film.id}" action="" method="post">
                <div class="rating" id="rating-${film.id}">
                    <input type="radio" id="star1-${film.id}" name="rating-${film.id}" value="1">
                    <label for="star1-${film.id}"><i class="bi bi-star-fill"></i></label>

                    <input type="radio" id="star2-${film.id}" name="rating-${film.id}" value="2">
                    <label for="star2-${film.id}"><i class="bi bi-star-fill"></i></label>

                    <input type="radio" id="star3-${film.id}" name="rating-${film.id}" value="3">
                    <label for="star3-${film.id}"><i class="bi bi-star-fill"></i></label>

                    <input type="radio" id="star4-${film.id}" name="rating-${film.id}" value="4">
                    <label for="star4-${film.id}"><i class="bi bi-star-fill"></i></label>

                    <input type="radio" id="star5-${film.id}" name="rating-${film.id}" value="5">
                    <label for="star5-${film.id}"><i class="bi bi-star-fill"></i></label>
                </div>
                    <button type="submit" class="btn btn-primary mt-2" id="ratebtn">Oceń</button>
                </form>
                <hr />
        `

        let filmInfo = `
            <h3 class="film-title">${film.title}</h3>
            <img class="MoviePhotos" src="${film.imageURL}" alt="">
            <h4 class="prodYear">Rok produkcji: ${film.prodYear}</h4>
            <p class="categories">${category1}</p>
            <p class="categories">${category2}</p>
        `;
        let filmDesc = `
            <button class="MovieControls" id="softdel-film-${film.id}"><i class="bi bi-trash-fill"></i></button>
            <a href ="edytowanieFilmu.html"><button class="MovieControls" id="edit-film-${film.id}"><i class="bi bi-pencil-fill"></i></button></a> 
            <h5 class="film-desc-title">Opis filmu:</h5>
            <p class="film-desc">${film.description}</p>
            <p class ="ratings">Oceny użytkowników: <br>
            ${ratingf}</p>
            <p class ="ratingsNum">Liczba ocen: ${ratingnum}</p>
            <p class ="awards">Nagrody: ${film.awards}</p>
            <p class = "imdbRating">Ranking IMDB: ${imdbr}</p>
            
        `;
        
        
        let filmLeft = document.createElement("div");
        filmLeft.classList.add("film-left");
        filmLeft.innerHTML = filmInfo;

        let filmRight = document.createElement("div");
        filmRight.classList.add("film-right");
        filmRight.innerHTML = filmDesc;
        
        filmBlock.appendChild(filmLeft);
        filmBlock.appendChild(filmRight);
        filmContainer.appendChild(filmBlock);
        main.appendChild(filmContainer);
        main.appendChild(filmRating);
        i++;
    });
        } 
    
});
    }
}
function sortCategory(data) {
    let main = document.getElementById("main");
    main.innerHTML = "";
    if (data.length == 0) {
        let noResult = document.createElement("div");
        noResult.innerHTML = "<h3>Brak wyników z tej kategorii</h3>"
        main.appendChild(noResult);
    }
    else {
        let i = 0;
    data.forEach(film => {

        let category1 = "Brak";
        let category2 = "Brak";
        if (film.categories.length < 2) {
            category1 = film.categories[0].name;
        } else {
            category1 = film.categories[0].name;
            category2 = film.categories[1].name;
        }
        let ratingf = "Brak";
        if (film.rating != null) {
            ratingf = film.rating + '/5';
        }
        let ratingnum = "Brak";
        if (film.ratingsNumber != null) {
            ratingnum = film.ratingsNumber;
        }
        let imdbr = "Brak";
        if (film.imdbrating != null) {
            imdbr = film.imdbrating;
        }


        let filmContainer = document.createElement("div");
        filmContainer.classList.add("film-container");
        
        
        let filmBlock = document.createElement("div");
        filmBlock.classList.add("OddMovies");
        filmBlock.style.display = "flex";
        filmBlock.style.flexDirection = "row";
        filmBlock.style.gap = "20px";

        let filmRating = document.createElement("div");
        filmRating.classList.add("oceny");
        filmRating.innerHTML = `
                <h6 class="text-center">Oceń film</h6>
                <form class ="rating-form" data-film-id = "${film.id}" action="" method="post">
                <div class="rating" id="rating-${film.id}">
                    <input type="radio" id="star1-${film.id}" name="rating-${film.id}" value="1">
                    <label for="star1-${film.id}"><i class="bi bi-star-fill"></i></label>

                    <input type="radio" id="star2-${film.id}" name="rating-${film.id}" value="2">
                    <label for="star2-${film.id}"><i class="bi bi-star-fill"></i></label>

                    <input type="radio" id="star3-${film.id}" name="rating-${film.id}" value="3">
                    <label for="star3-${film.id}"><i class="bi bi-star-fill"></i></label>

                    <input type="radio" id="star4-${film.id}" name="rating-${film.id}" value="4">
                    <label for="star4-${film.id}"><i class="bi bi-star-fill"></i></label>

                    <input type="radio" id="star5-${film.id}" name="rating-${film.id}" value="5">
                    <label for="star5-${film.id}"><i class="bi bi-star-fill"></i></label>
                </div>
                    <button type="submit" class="btn btn-primary mt-2" id="ratebtn">Oceń</button>
                </form>
                <hr />
        `

        let filmInfo = `
            <h3 class="film-title">${film.title}</h3>
            <img class="MoviePhotos" src="${film.imageURL}" alt="">
            <h4 class="prodYear">Rok produkcji: ${film.prodYear}</h4>
            <p class="categories">${category1}</p>
            <p class="categories">${category2}</p>
        `;
        let filmDesc = `
            <button class="MovieControls" id="softdel-film-${film.id}"><i class="bi bi-trash-fill"></i></button>
            <a href ="edytowanieFilmu.html"><button class="MovieControls" id="edit-film-${film.id}"><i class="bi bi-pencil-fill"></i></button></a>
            <h5 class="film-desc-title">Opis filmu:</h5>
            <p class="film-desc">${film.description}</p>
            <p class ="ratings">Oceny użytkowników: <br>
            ${ratingf}</p>
            <p class ="ratingsNum">Liczba ocen: ${ratingnum}</p>
            <p class ="awards">Nagrody: ${film.awards}</p>
            <p class = "imdbRating">Ranking IMDB: ${imdbr}</p>
            
        `;
        
        
        let filmLeft = document.createElement("div");
        filmLeft.classList.add("film-left");
        filmLeft.innerHTML = filmInfo;

        let filmRight = document.createElement("div");
        filmRight.classList.add("film-right");
        filmRight.innerHTML = filmDesc;
        
        filmBlock.appendChild(filmLeft);
        filmBlock.appendChild(filmRight);
        filmContainer.appendChild(filmBlock);
        main.appendChild(filmContainer);
        main.appendChild(filmRating);
        i++;
    });
        
        let categorySelect = document.querySelectorAll(".dropdown-item").forEach(item => {
            
        let categoryClicked = item.textContent;
        
        if (categoryClicked == category1) {
            newFilmLeft.innerHTML += `<p class = "categories">${film.categories[0].name}</p>`;
        }
        if (categoryClicked == category2) {
            newFilmLeft.innerHTML += `<p class = "categories">${film.categories[1].name}</p>`;
        }
        });
    }
}

function displayFilmsInitial(data) {
    let main = document.getElementById("main");
    main.innerHTML = "";
    let i = 0;
    data.forEach(film => {
        let category1 = "Brak";
        let category2 = "Brak";
        if (film.categories.length < 2) {
            category1 = film.categories[0].name;
        } else {
            category1 = film.categories[0].name;
            category2 = film.categories[1].name;
        }
        let ratingf = "Brak";
        if (film.rating != null) {
            ratingf = film.rating + '/5';
        }
        let ratingnum = "Brak";
        if (film.ratingsNumber != null) {
            ratingnum = film.ratingsNumber;
        }
        let imdbr = "Brak";
        if (film.imdbrating != null) {
            imdbr = film.imdbrating;
        }


        let filmContainer = document.createElement("div");
        filmContainer.classList.add("film-container");
        
        
        let filmBlock = document.createElement("div");
        filmBlock.classList.add("OddMovies");
        filmBlock.style.display = "flex";
        filmBlock.style.flexDirection = "row";
        filmBlock.style.gap = "20px";

        let filmRating = document.createElement("div");
        filmRating.classList.add("oceny");
        filmRating.innerHTML = `
                <h6 class="text-center">Oceń film</h6>
                <form class ="rating-form" data-film-id = "${film.id}" method="post">
                <div class="rating" id="rating-${film.id}">
                    <input type="radio" id="star5-${film.id}" name="rating-${film.id}" value="5">
                    <label for="star5-${film.id}"><i class="bi bi-star-fill" id="ratebtn"></i></label>

                    <input type="radio" id="star4-${film.id}" name="rating-${film.id}" value="4">
                    <label for="star4-${film.id}"><i class="bi bi-star-fill"></i></label>

                    <input type="radio" id="star3-${film.id}" name="rating-${film.id}" value="3">
                    <label for="star3-${film.id}"><i class="bi bi-star-fill"></i></label>

                    <input type="radio" id="star2-${film.id}" name="rating-${film.id}" value="2">
                    <label for="star2-${film.id}"><i class="bi bi-star-fill"></i></label>

                    <input type="radio" id="star1-${film.id}" name="rating-${film.id}" value="1">
                    <label for="star1-${film.id}"><i class="bi bi-star-fill"></i></label>
                </div>
                    <button type="submit" class="btn btn-primary mt-2">Oceń</button>
                </form>
                <hr />
        `

        let filmInfo = `
            <h3 class="film-title">${film.title}</h3>
            <img class="MoviePhotos" src="${film.imageURL}" alt="">
            <h4 class="prodYear">Rok produkcji: ${film.prodYear}</h4>
            <p class="categories">${category1}</p>
            <p class="categories">${category2}</p>
        `;
        let filmDesc = `
            <button class="MovieControls" id="softdel-film-${film.id}"><i class="bi bi-trash-fill"></i></button>
            <a href ="edytowanieFilmu.html?id=${film.id}"><button class="MovieControls" id="edit-film-${film.id}"><i class="bi bi-pencil-fill"></i></button></a>
            <h5 class="film-desc-title">Opis filmu:</h5>
            <p class="film-desc">${film.description}</p>
            <p class ="ratings">Oceny użytkowników: <br>
            ${ratingf}</p>
            <p class ="ratingsNum">Liczba ocen: ${ratingnum}</p>
            <p class ="awards">Nagrody: ${film.awards}</p>
            <p class = "imdbRating">Ranking IMDB: ${imdbr}</p>
            <input type="hidden" name="id" id="id" value="${film.id}">
            
        `;
        
        
        let filmLeft = document.createElement("div");
        filmLeft.classList.add("film-left");
        filmLeft.innerHTML = filmInfo;

        let filmRight = document.createElement("div");
        filmRight.classList.add("film-right");
        filmRight.innerHTML = filmDesc;
        
        filmBlock.appendChild(filmLeft);
        filmBlock.appendChild(filmRight);
        filmContainer.appendChild(filmBlock);
        main.appendChild(filmContainer);
        main.appendChild(filmRating);
        i++;

        let delbtn = document.getElementById(`softdel-film-${film.id}`);
        delbtn.addEventListener("click", function() {
        const apiurl = window.API_URL + 'delete/' + film.id
        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }
        fetch(apiurl, request)
        .then(response => console.log(response))
        .catch(error => console.error("Błąd z usunięciem", error));

        alert("Pomyślnie usunięto film!");
        window.location.reload();
    });
    });
    document.querySelectorAll(".rating-form").forEach(form => {
        form.addEventListener("submit", function(event) {
        event.preventDefault();
        const filmId = form.dataset.filmId;
        const rating = document.querySelector(`input[name="rating-${filmId}"]:checked`);
            if (rating == null) {
                alert("Proszę wybrać ocenę przed wysłaniem.");
            }
    
        const apiurl = window.API_URL + `rate/${filmId}?rating=${rating.value}`; 
        const request = {
            method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
        }
        fetch(apiurl, request)
            .then(response => response.json())
            .catch(error => console.error("Błąd z ocenieniem filmu", error));
        
        alert("Pomyślnie oceniono film!");
        window.location.reload();
        });
    });
}


