// get data from api with jquery

// $("#btn-search").on("click", function () {
//   const search = $("#search").val();

//   $.ajax({
//     url: `http://www.omdbapi.com/?apikey=596d6f15&s=` + search,
//     type: "get",
//     success: function (response) {
//       const movies = response.Search;
//       let cards = "";
//       movies.forEach((movie) => {
//         cards += showMovies(movie);

//         $("#movie-container").html(cards);

//         // ketika tombol detail di-klick
//         $(".modal-detail-button").on("click", function () {
//           // jalankan ajax untuk request detail film
//           $.ajax({
//             url: `http://www.omdbapi.com/?apikey=596d6f15&i=` + $(this).data("imdbid"),
//             type: "get",
//             success: (movie) => {
//               const movieDetail = modalDetailMovie(movie);
//               $("#modal-detail").html(movieDetail);
//             },
//           });
//         });
//       });
//     },
//     error: function (err) {
//       console.log(err.responseText);
//     },
//   });
// });

// get data to api with fetch modern javascript

// const btnSeacrh = document.getElementById("btn-search");
// btnSeacrh.addEventListener("click", function () {
//   const search = document.getElementById("search").value;
//   // jalankan fetch
//   fetch("http://www.omdbapi.com/?apikey=596d6f15&s=" + search)
//     .finally(() => alert("loading......"))
//     // response promise
//     .then((response) => response.json())
//     // response object
//     .then((response) => {
//       const movies = response.Search;
//       let cards = "";
//       movies.forEach((movie) => {
//         // show cards
//         cards += showMovies(movie);
//         let movieContainer = document.getElementById("movie-container");
//         movieContainer.innerHTML = cards;

//         // show detail
//         const btnModalDetail = document.querySelectorAll(".modal-detail-button");
//         btnModalDetail.forEach((btnDetail) => {
//           btnDetail.addEventListener("click", function () {
//             // get data imdbid
//             const imdbid = this.dataset.imdbid;
//             fetch("http://www.omdbapi.com/?apikey=596d6f15&i=" + imdbid)
//               .then((response) => response.json())
//               .then((response) => {
//                 let modalContainer = document.getElementById("modal-detail");
//                 modalContainer.innerHTML = modalDetailMovie(response);
//               })
//               .catch((response) => console.log("error: " + response));
//           });
//         });
//       });
//     })
//     .catch((response) => {
//       console.log(response);
//       alert("data tidak ditemukan!!");
//     });
// });

// -------------------------------------------------------------------------------------------------------------------------------

// main function
const btnSeacrh = document.getElementById("btn-search");
btnSeacrh.addEventListener("click", async function () {
  try { //jika resolve
    const search = document.getElementById("search").value;
    // berjalan secara syncrohnous, agar asnychronous kita tambahkan async dan await
    const movies = await getApiMovies(search);
    updateUiCard(movies);
  } catch(err) { //jika reject
   alert(err);
  }
});


// get api movies
function getApiMovies(search) {
  // jalankan fetch
  return (
    fetch("http://www.omdbapi.com/?apikey=596d6f15&s=" + search)
      // response promise
      .then((response) => {
        // cek apakah keynya sudah benar / error dari url
        if(!response.ok) {
          throw new Error(response.statusText); //error akan dilempar ke catch
        }
       return response.json();
      })
      // response object
      .then((response) => {
        // erro saat tidak ada yang disearch dan tidak ada filmnya / error dari sisi api imdb
        if(response.Response === 'False') {
          throw new Error(response.Error);
        }
        // yang dikemablikan data fetch
        return response.Search;
      })
  );
}

// update ui card
function updateUiCard(movies) {
  let cards = "";
  movies.forEach((movie) => {
    // show cards
    cards += showMovies(movie);
    let movieContainer = document.getElementById("movie-container");
    movieContainer.innerHTML = cards;
  });
}


 //second function  / detail movie
//  berjalan secara synchronous / mengatasinya dengan event binding
document.addEventListener("click", async function (e) {
  // cari target dari tombol yang kita click dan apakah sama dengan class di contains
  if(e.target.classList.contains('modal-detail-button')) {
    // get data imdbid
    const imdbid = e.target.dataset.imdbid;
    // berjalan secara syncrohnous, agar asnychronous kita tambahkan async dan await
    const detailMovie = await getApiDetail(imdbid);
    updateUiDetail(detailMovie);
  }
});

// get api detail movie
function getApiDetail(imdbid) {
  return  fetch("http://www.omdbapi.com/?apikey=596d6f15&i=" + imdbid)
            .then((response) => response.json())
            .then((response) => response )
            .catch((response) => console.log("error: " + response))
}

// update ui detail
function updateUiDetail(detailMovie) {
  let modalContainer = document.getElementById("modal-detail");
  modalContainer.innerHTML = modalDetailMovie(detailMovie);
}


// function show card movie 
function showMovies(movie) {
  return `<div class="col-md-3 my-5">
            <div class="card shadow">
                <img src="${movie.Poster}" class="card-img-top" />
                <div class="card-body">
                    <h5 class="card-title">${movie.Title}</h5>
                    <h6 class="card-year text-muted mb-2">${movie.Year}</h6>
                    <a href="#" class='modal-detail-button btn btn-primary' data-bs-target='#movieDetailModal' data-bs-toggle='modal' data-imdbid='${movie.imdbID}' class="btn btn-primary">Show Detail</a>
                </div>
            </div>
          </div>`;
}

// show detail movie
function modalDetailMovie(movie) {
  return ` <div class="container-fluid">
              <div class="row">
                <div class="col-md-3">
                  <img src="${movie.Poster}" class='img-fulid'/>
                </div>
                <div class="col-md">
                  <ul class="list-group">
                    <li class="list-group-item">${movie.Title} (${movie.Year})</li>
                    <li class="list-group-item"><strong>Director : </strong>${movie.Director}</li>
                    <li class="list-group-item"><strong>Actors : </strong>${movie.Actors}</li>
                    <li class="list-group-item"><strong>Writer : </strong>${movie.Writer}</li>
                    <li class="list-group-item"><strong>Plot : </strong>${movie.Plot}</li>
                  </ul>
                </div>
              </div>
            </div>`;
}
