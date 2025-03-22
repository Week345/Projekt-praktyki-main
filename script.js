<<<<<<< HEAD
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

                let filmContainer = document.createElement("div");
                filmContainer.classList.add("film-container");
                
                let filmBlock = document.createElement("div");
                filmBlock.classList.add(i % 2 != 0 ? "EvenMovies" : "OddMovies");
                filmBlock.style.display = "flex";
                filmBlock.style.flexDirection = "row";
                filmBlock.style.gap = "20px";

                let filmRating = document.createElement("div");
                filmRating.classList.add("oceny");
                filmRating.innerHTML = `
                        <h6 class="text-center">Oceń film</h6>
                        <form action="" method="post">
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
                            <button type="submit" class="btn btn-primary mt-2">Oceń</button>
                        </form>
                        <hr />
                `
                
                let filmImage = `<img class="MoviePhotos" src="" alt="">`;
                let filmInfo = `
                    <h3 class="film-title">${film.title}</h3>
                    ${filmImage}
                    <h4 class="prodYear">Rok produkcji: ${film.prodYear}</h4>
                    <p class="categories">${category1}</p>
                    <p class="categories">${category2}</p>
                `;
                let filmDesc = `
                    <button class="MovieControls"><i class="bi bi-trash-fill"></i></button>
                    <button class="MovieControls"><i class="bi bi-pencil-fill"></i></button>   
                    <h5 class="film-desc-title">Opis filmu:</h5>
                    <p class="film-desc">${film.description}</p>
                    <p class ="ratings">Oceny użytkowników: <br>
                    ${film.rating}/5</p>
                    <p class ="ratingsNum">Liczba ocen: ${film.ratingsNumber}</p>
                    <p class ="awards">Nagrody: ${film.awards}</p>
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
        
        let filmContainer = document.createElement("div");
        filmContainer.classList.add("film-container");
        
        let filmBlock = document.createElement("div");
        filmBlock.classList.add(i % 2 != 0 ? "EvenMovies" : "OddMovies");
        filmBlock.style.display = "flex";
        filmBlock.style.flexDirection = "row";
        filmBlock.style.gap = "20px";

        let filmRating = document.createElement("div");
        filmRating.classList.add("oceny");
        filmRating.innerHTML = `
                <h6 class="text-center">Oceń film</h6>
                <form action="" method="post">
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
                    <button type="submit" class="btn btn-primary mt-2">Oceń</button>
                </form>
                <hr />
        `

        let filmImage = `<img class="MoviePhotos" src="" alt="">`;
        let filmInfo = `
            <h3 class="film-title">${film.title}</h3>
            ${filmImage}
            <h4 class="prodYear">Rok produkcji: ${film.prodYear}</h4>
            <p class="categories">${category1}</p>
            <p class="categories">${category2}</p>
        `;
        let filmDesc = `
            <button class="MovieControls"><i class="bi bi-trash-fill"></i></button>
            <button class="MovieControls"><i class="bi bi-pencil-fill"></i></button>   
            <h5 class="film-desc-title">Opis filmu:</h5>
            <p class="film-desc">${film.description}</p>
            <p class ="ratings">Oceny użytkowników: <br>
            ${film.rating}/5</p>
            <p class ="ratingsNum">Liczba ocen: ${film.ratingsNumber}</p>
            <p class ="awards">Nagrody: ${film.awards}</p>
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

        let filmContainer = document.createElement("div");
        filmContainer.classList.add("film-container");
        
        
        let filmBlock = document.createElement("div");
        filmBlock.classList.add(i % 2 != 0 ? "EvenMovies" : "OddMovies");
        filmBlock.style.display = "flex";
        filmBlock.style.flexDirection = "row";
        filmBlock.style.gap = "20px";

        let filmRating = document.createElement("div");
        filmRating.classList.add("oceny");
        filmRating.innerHTML = `
                <h6 class="text-center">Oceń film</h6>
                <form action="" method="post">
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
                    <button type="submit" class="btn btn-primary mt-2">Oceń</button>
                </form>
                <hr />
        `

        let filmImage = `<img class="MoviePhotos" src="" alt="">`;
        let filmInfo = `
            <h3 class="film-title">${film.title}</h3>
            ${filmImage}
            <h4 class="prodYear">Rok produkcji: ${film.prodYear}</h4>
            <p class="categories">${category1}</p>
            <p class="categories">${category2}</p>
        `;
        let filmDesc = `
            <button class="MovieControls"><i class="bi bi-trash-fill"></i></button>
            <button class="MovieControls"><i class="bi bi-pencil-fill"></i></button>   
            <h5 class="film-desc-title">Opis filmu:</h5>
            <p class="film-desc">${film.description}</p>
            <p class ="ratings">Oceny użytkowników: <br>
            ${film.rating}/5</p>
            <p class ="ratingsNum">Liczba ocen: ${film.ratingsNumber}</p>
            <p class ="awards">Nagrody: ${film.awards}</p>
        
            
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
=======
function getData(id) {
    const url = window.API_URL + id
    const request = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }
    fetch(url, request)
        .then(response => response.json())
        .then(console.log(response))
        .catch(error => console.error("Błąd z pobraniem filmu", error))
}

document.addEventListener("DOMContentLoaded", function () {
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
            let newFilmLeft = document.createElement("div");
            newFilmLeft.classList.add("OddMoviesSearch");
            let newFilmRight = document.createElement("div");
            newFilmRight.classList.add("OddMovieDescSearch");
            newFilmLeft.innerHTML = `<h3 id ="filmTitle">${dfilm.title}</h3><p><img id="movPhoto" class="MoviePhotos" src="">
            <h4 id = "yearSearch" class ="text-center.prodYear">Rok produkcji: <br>${dfilm.prodYear}</p>
            <p id = "cat1">${dfilm.categories[0].name}</p><p id = "cat2">${dfilm.categories[1].name}</p>`;
            newFilmRight.innerHTML = `<h5 id="filmDesc">Opis filmu: <br><br></h5><p id ="descPara">${dfilm.description}</p>`;
            main.appendChild(newFilmLeft);
            main.appendChild(newFilmRight);
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
    data.forEach(catfilm => {
        let category1 = "Brak";
        let category2 = "Brak";
        if (catfilm.categories.length < 2) {
            category1 = catfilm.categories[0].name;
        } else {
            category1 = catfilm.categories[0].name;
            category2 = catfilm.categories[1].name;
        }
        let newFilmLeftC = document.createElement("div");
        newFilmLeftC.classList.add("container.OddMoviesSearch");
        let newFilmLeft = document.createElement("div");
        newFilmLeft.classList.add("OddMoviesSearch");
        let newFilmRightC = document.createElement("div");
        let newFilmRight = document.createElement("div");
        newFilmRight.classList.add("OddMoviesDescSearch");
        newFilmRightC.classList.add("container.OddMovieDescSearch");
        newFilmLeft.innerHTML = `<h3 id ="filmTitle">${catfilm.title}</h3><p><img id="movPhoto" class="MoviePhotos" src="">
        <h4 id = "yearSearch" class ="text-center.prodYear">Rok produkcji: <br>${catfilm.prodYear}</p>`
        newFilmRight.innerHTML = `<h5 id="filmDesc">Opis filmu: <br><br></h5><p id ="descPara">${catfilm.description}</p>`;
        main.appendChild(newFilmLeftC);
        main.appendChild(newFilmRightC);
        newFilmLeftC.appendChild(newFilmLeft);
        newFilmRightC.appendChild(newFilmRight);
        let categorySelect = document.querySelectorAll(".dropdown-item").forEach(item => {
        let categoryClicked = item.textContent;
        if (categoryClicked == category1) {
            newFilmLeft.innerHTML += `<p id = "cat1">${catfilm.categories[0].name}</p>`;
        }
        if (categoryClicked == category2) {
            newFilmLeft.innerHTML += `<p id = "cat1">${catfilm.categories[1].name}</p>`;
        }
        });
    });
        }
}
>>>>>>> c71b981d95f45444743e93c42445d686be5a6096
