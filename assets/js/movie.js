function renderFilmDetails(id){

    let storage = localStorage.getItem("movieSearchDetail");
    let storageArr = JSON.parse(storage);

    storageArr.forEach(arr =>{

    if (arr.id == id) {

        renderDetailHTML(arr);


        }

    })

};


function renderDetailHTML(arr){


let output = $("#movie-detail-header");
output.empty();

let imageURL = `https://image.tmdb.org/t/p/w200${arr.detail.poster_path}`;
let image = $("<img>");
image.addClass("img-fluid p-5")
image.attr('src', imageURL);
output.append(image);

let div = $("<div>");
output.append(div);

let h1 = $("<h1>");
h1.text(arr.detail.title);
div.append(h1);

let h4 = $("<h4>");
h4.text(`Released: ${arr.detail.release_date}`);
div.append(h4);

let p = $("<p>");
p.text(arr.detail.overview);
div.append(p);

let h5 = $("<h5>");
h5.text(arr.imdb.Genre);
div.append(h5);

let p1 = $("<p>");
p1.text(`Director: ${arr.imdb.Director}`);
div.append(p1);

let creditsArr = arr.credits.cast;

let crewOutput = $("#crew-detail");
crewOutput.empty();

let cardDeckDiv = $("<div>");
cardDeckDiv.addClass('card-deck');
crewOutput.append(cardDeckDiv);

creditsArr.forEach((arr, index) => {

    if (index < 8) {

        let cardDiv = $("<div>");
        cardDiv.addClass('card');
        cardDiv.attr('style',"width: 2rem;")
    
        crewOutput.append(cardDeckDiv);
        cardDeckDiv.append(cardDiv);
    
        let imageURL = `https://image.tmdb.org/t/p/w185${arr.profile_path}`;
        let image = $("<img>");
        image.attr('src', imageURL);
        image.attr('style','width: 100px')
        cardDiv.append(image);
    
        let cardBody = $("<div>");
        cardBody.addClass("card-body");
        cardDiv.append(cardBody);
    
        let title = $("<h5>");
        title.addClass("card-text");
        title.text(arr.name);
        cardBody.append(title);

        }

    })


    
};


function checkLocalDetail(id){

    let storage = localStorage.getItem("movieSearchDetail");
    let storageArr = JSON.parse(storage);

    if (storageArr.some(arr => arr['id'] == id)) {

            renderFilmDetails(id);
            console.log('found',id);      


    } else {

            filmDetail(id); 
            console.log('new',id)
          

    }

}


function filmDetail(id){

    let filmId = id;

    const detailURL = `https://api.themoviedb.org/3/movie/${filmId}?api_key=${APIkeyTMDB}&append_to_response=videos,images`;

    const creditsURL = `https://api.themoviedb.org/3/movie/${filmId}/credits?api_key=${APIkeyTMDB}&language=en-US`

    const reviewURL = `https://api.themoviedb.org/3/movie/${filmId}/reviews?api_key=${APIkeyTMDB}`;

    let detailObject = new Object();

    detailObject['id'] = filmId;

    $.ajax({

        url: detailURL,
        method: "GET"

    }).then(function(response){

        let data = response;
        
        detailObject['detail'] = data;

        return data;

    }).then(function(data){

        let reply = data;

        let omdbId = data.imdb_id;
        const omdbURL = `http://www.omdbapi.com/?i=${omdbId}&apikey=${APIkeyOMDB}`;

        $.ajax({

            url: omdbURL,
            method: "GET"

        }).then(function(response){

            detailObject['imdb'] = response;
            return reply

        }).then(function(reply){

            let data = reply;
       
              $.ajax({
       
               url: creditsURL,
               method: "GET"
       
              }).then(function(response){
       
                   detailObject['credits'] = response;
       
              })
       
              return data;
       
           }).then(function(data){
       
               $.ajax({
       
                   url: reviewURL,
                   method: "GET"
       
               }).then(function(response){
       
                   let output = response;
                   detailObject['reviews'] = response;
                    
                   renderDetailHTML(detailObject);
                   
                   updateLocalMovieDetail(detailObject);
       
               })
       
           })

        })

};


function updateLocalMovieDetail(object){

    //get local storage
    let storage = localStorage.getItem("movieSearchDetail");
    let storageArr = JSON.parse(storage);

    //create an empty array and push instance of storage object
    let array = [];
    array.push(object);

    //if storage array already exists, replace existing entry - else push history into new array
    if (storageArr != null) {

        storageArr.forEach(arr => {
   
            if (arr.id == object.id) {
                return;
            } else {
                array.push(arr)
            }
        })
    
        }

    localStorage.setItem("movieSearchDetail", JSON.stringify(array));

};


checkLocalDetail(localStorage.getItem('filmDetailCurrent'));