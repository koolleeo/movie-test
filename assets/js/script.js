//create a blueprint for returned movie search object

function movieArrayObj(searchTerm, date, results) {

    this.searchTerm = searchTerm;
    this.date = date;
    this.results = results;

};

const APIkeyTMDB = '4ea43f6025357b9622135c80346e095e';
const APIkeyOMDB = '29841051';

function movieSearch(movie){

    let APIurl;
    let searchTerm = movie;

    switch (movie) {
        case 'Trending':
            APIurl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${APIkeyTMDB}&language=en-US&page=1`;
            break;
        case 'Popular':
            APIurl = `https://api.themoviedb.org/3/movie/popular?api_key=${APIkeyTMDB}&language=en-US&page=1`;
            break;
        case 'Top rated':
            APIurl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${APIkeyTMDB}&language=en-US&page=1`;
            break;
        case 'Upcoming':
            APIurl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${APIkeyTMDB}&language=en-US&page=1`;
            break;
        default:
            APIurl = `https://api.themoviedb.org/3/search/movie?query=${movie}&api_key=${APIkeyTMDB}&language=en-US&page=1&include_adult=true`;
            break;
    };


    $.ajax({

        url: APIurl,
        method: "GET"

    }).then(function(response){


        let reply = response.results;

        if (reply.length != 0) {

        let currentDate = moment().format("YYYYMMDD");
        let resultsObj = new movieArrayObj(searchTerm, currentDate, reply);

        return resultsObj;

    } else {

        throw new Error('Unable to find movie. Please try again');
    }

    })
    .then(function(data){

        let arr = data;

        dynamicHTML(arr);

    return arr;

}).then(function(arr) {

    updateLocalMovieSearch(arr);

}).catch(function(error) {

    alert(error.message);
    
});

};

function dynamicHTML(arr){

    let output = $("#card-output");
    output.empty();
    let cardDeckDiv = $("<div>");
    cardDeckDiv.addClass('card-deck');

    arr.results.forEach((arr, index) => {

    if (index < 8) {

    let cardDiv = $("<div>");
    cardDiv.addClass('card');
    cardDiv.attr('style',"width: 16rem;")

    output.append(cardDeckDiv);
    cardDeckDiv.append(cardDiv);

    let imageURL = `https://image.tmdb.org/t/p/w500${arr.poster_path}`;
    let image = $("<img>");
    image.attr('src', imageURL);
    cardDiv.append(image);

    let cardBody = $("<div>");
    cardBody.addClass("card-body");
    cardDiv.append(cardBody);

    let title = $("<h5>");
    title.addClass("card-text");
    title.text(arr.title);
    cardBody.append(title);

    let release = $("<p>");
    release.text(arr.release_date);
    cardBody.append(release);

    let rating = $("<p>");
    rating.text(arr.vote_average);
    cardBody.append(rating);

    let btn = $("<a>");
    btn.addClass("btn btn-primary btn-more");
    btn.attr('data-id',arr.id)
    btn.text('See More');
    cardBody.append(btn);
    
            }

        }) 

    }


function updateLocalMovieSearch(object){

    //get local storage
    let storage = localStorage.getItem("movieSearchHistory");
    let storageArr = JSON.parse(storage);

    //create an empty array and push instance of storage object
    let array = [];
    array.push(object);

    //if storage array already exists, replace existing entry - else push history into new array
    if (storageArr != null) {

        storageArr.forEach(arr => {
   
            if (arr.searchTerm == object.searchTerm) {
                return;
            } else {
                array.push(arr)
            }
        })
    
        }

    localStorage.setItem("movieSearchHistory", JSON.stringify(array));

};


// function filmDetail(id){

//     let filmId = id;

//     const detailURL = `https://api.themoviedb.org/3/movie/${filmId}?api_key=${APIkeyTMDB}&append_to_response=videos,images`;

//     const creditsURL = `https://api.themoviedb.org/3/movie/${filmId}/credits?api_key=${APIkeyTMDB}&language=en-US`

//     const reviewURL = `https://api.themoviedb.org/3/movie/${filmId}/reviews?api_key=${APIkeyTMDB}`;

//     let detailObject = new Object();

//     detailObject['id'] = filmId;

//     $.ajax({

//         url: detailURL,
//         method: "GET"

//     }).then(function(response){

//         let data = response;
        
//         detailObject['detail'] = data;

//         return data;

//     }).then(function(data){

//         let reply = data;

//         let omdbId = data.imdb_id;
//         const omdbURL = `http://www.omdbapi.com/?i=${omdbId}&apikey=${APIkeyOMDB}`;

//         $.ajax({

//             url: omdbURL,
//             method: "GET"

//         }).then(function(response){

//             detailObject['imdb'] = response;
//             return reply

//         }).then(function(reply){

//             let data = reply;
       
//               $.ajax({
       
//                url: creditsURL,
//                method: "GET"
       
//               }).then(function(response){
       
//                    detailObject['credits'] = response;
       
//               })
       
//               return data;
       
//            }).then(function(data){
       
//                $.ajax({
       
//                    url: reviewURL,
//                    method: "GET"
       
//                }).then(function(response){
       
//                    let output = response;
//                    detailObject['reviews'] = response;
                    
//                    renderDetailHTML(detailObject);
                   
//                    updateLocalMovieDetail(detailObject);
       
//                })
       
//            })

//         })

// };


// function updateLocalMovieDetail(object){

//     //get local storage
//     let storage = localStorage.getItem("movieSearchDetail");
//     let storageArr = JSON.parse(storage);

//     //create an empty array and push instance of storage object
//     let array = [];
//     array.push(object);

//     //if storage array already exists, replace existing entry - else push history into new array
//     if (storageArr != null) {

//         storageArr.forEach(arr => {
   
//             if (arr.id == object.id) {
//                 return;
//             } else {
//                 array.push(arr)
//             }
//         })
    
//         }

//     localStorage.setItem("movieSearchDetail", JSON.stringify(array));

// };


function checkLocalStorage(movie){

    let storage = localStorage.getItem("movieSearchHistory");
    let storageArr = JSON.parse(storage);

    let date = moment().format('YYYYMMDD');

    if (storageArr.some(arr => arr['searchTerm'] == movie && arr['date'] == date)) {

        renderStorage(movie);

    } else {

        movieSearch(movie)        

    }

}


function renderStorage(movie) {


    let storage = localStorage.getItem("movieSearchHistory");
    let storageArr = JSON.parse(storage);

    storageArr.forEach(arr =>{

    if (arr.searchTerm == movie) {

        dynamicHTML(arr);

    }

})

}


// on document load function

$(document).ready(function(){


    //immediately invoked function to update Trending data and set up initial page rendering
    
    /* IIFE */
    (function initialise() {
    
        // checkLocalStorage('Trending')
        movieSearch('Trending');
    
    })();
    
    
 // create an event listener to respond to dropdown button pressed

$(".dropdown-item").on('click',function(event){

    event.preventDefault();

    let reply = event.target.textContent;

    switch (reply) {
        case 'Trending':
            movieSearch('Trending');
            break;
        case 'Popular':
            movieSearch('Popular');
            break;
        case 'Top rated':
            movieSearch('Top rated');
            break;
        case 'Upcoming':
            movieSearch('Upcoming');
            break;
        default:
            return;
    }
    
});

// create an event listener for search button

$("#movie-search").on('click',function(event){

    event.preventDefault();

    let input = $("#search-input");
    
    checkLocalStorage(input[0].value)
    // movieSearch(input[0].value);

    input.val('');

});   


// create an event listener for film detail

$(document).on('click','.btn-more',function(event){

    event.preventDefault();

    // filmDetail(event.target.dataset.id);

    //checkLocalDetail(event.target.dataset.id);
    localStorage.setItem('filmDetailCurrent',event.target.dataset.id);
    
    $(location).attr('href','./movie.html');
    // window.location.href = './movie.html';
    

    });
    
});
    



// function renderFilmDetails(id){

//     let storage = localStorage.getItem("movieSearchDetail");
//     let storageArr = JSON.parse(storage);

//     storageArr.forEach(arr =>{

//     if (arr.id == id) {

//         renderDetailHTML(arr);


//         }

//     })

// };


// //window.location.href = '/movie.html';

// function renderDetailHTML(arr){


// let output = $("#movie-detail-header");
// output.empty();

// let imageURL = `https://image.tmdb.org/t/p/w200${arr.detail.poster_path}`;
// let image = $("<img>");
// image.addClass("img-fluid p-5")
// image.attr('src', imageURL);
// output.append(image);

// let div = $("<div>");
// output.append(div);

// let h1 = $("<h1>");
// h1.text(arr.detail.title);
// div.append(h1);

// let h4 = $("<h4>");
// h4.text(`Released: ${arr.detail.release_date}`);
// div.append(h4);

// let p = $("<p>");
// p.text(arr.detail.overview);
// div.append(p);

// let h5 = $("<h5>");
// h5.text(arr.imdb.Genre);
// div.append(h5);

// let p1 = $("<p>");
// p1.text(`Director: ${arr.imdb.Director}`);
// div.append(p1);

// let creditsArr = arr.credits.cast;

// let crewOutput = $("#crew-detail");
// crewOutput.empty();

// let cardDeckDiv = $("<div>");
// cardDeckDiv.addClass('card-deck');
// crewOutput.append(cardDeckDiv);

// creditsArr.forEach((arr, index) => {

//     if (index < 8) {

//         let cardDiv = $("<div>");
//         cardDiv.addClass('card');
//         cardDiv.attr('style',"width: 2rem;")
    
//         crewOutput.append(cardDeckDiv);
//         cardDeckDiv.append(cardDiv);
    
//         let imageURL = `https://image.tmdb.org/t/p/w185${arr.profile_path}`;
//         let image = $("<img>");
//         image.attr('src', imageURL);
//         image.attr('style','width: 100px')
//         cardDiv.append(image);
    
//         let cardBody = $("<div>");
//         cardBody.addClass("card-body");
//         cardDiv.append(cardBody);
    
//         let title = $("<h5>");
//         title.addClass("card-text");
//         title.text(arr.name);
//         cardBody.append(title);

//         }

//     })


    
// };


// function checkLocalDetail(id){

//     let storage = localStorage.getItem("movieSearchDetail");
//     let storageArr = JSON.parse(storage);

//     if (storageArr.some(arr => arr['id'] == id)) {

//             renderFilmDetails(id);
//             console.log('found',id);      


//     } else {

//             filmDetail(id); 
//             console.log('new',id)
          

//     }

// }

