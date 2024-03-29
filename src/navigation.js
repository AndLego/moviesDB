//miscellaneous
let page = 1;
let maxPage;
let infiniteScroll;

//Navbar Listeners ----------------------------

navDiscover.addEventListener("click", () => {
  location.hash = "#home";
});
navSearch.addEventListener("click", () => {
  location.hash = "#search=";
});
navTrend.addEventListener("click", () => {
  location.hash = "#favorites";
});
navAbout.addEventListener("click", () => {
  location.hash = "#about";
});

arrowBtn.addEventListener("click", () => {
  history.back();
});


//General---------------------------------------------------

window.addEventListener("DOMContentLoaded", navigator, false);
window.addEventListener("hashchange", navigator, false);
window.addEventListener("scroll", infiniteScroll, false);

function navigator() {
  if (infiniteScroll) {
    window.removeEventListener("scroll", infiniteScroll, { passive: false });
    infiniteScroll = undefined;
  }

  location.hash.startsWith("#home")
    ? discover()
    : location.hash.startsWith("#search=")
    ? searchPage()
    : location.hash.startsWith("#favorites")
    ? favoritesPage()
    : location.hash.startsWith("#about")
    ? aboutPage()
    : location.hash.startsWith("#movie=")
    ? movieShowDetail()
    : location.hash.startsWith("#category=")
    ? categoriesPage()
    : discover();

  if (infiniteScroll) {
    window.addEventListener("scroll", infiniteScroll, { passive: false });
  }

  smoothscroll();
}

function smoothscroll() {
  const currentScroll =
    document.documentElement.scrollTop || document.body.scrollTop;
  if (currentScroll > 0) {
    window.requestAnimationFrame(smoothscroll);
    window.scrollTo(0, currentScroll - currentScroll / 5);
  }
}

function discover() {
  arrowBtn.classList.add("inactive");
  headerTitle.classList.remove("inactive");

  trendingTv.classList.remove("inactive");
  favorites.classList.remove("inactive");
  trendingMovies.classList.remove("inactive");
  trendingPeople.classList.remove("inactive");
  genres.classList.remove("inactive");
  popularMovies.classList.remove("inactive");
  popularTv.classList.remove("inactive");
  upcomingMovies.classList.remove("inactive");
  topShow.classList.remove("inactive");
  topMovie.classList.remove("inactive");

  aboutSection.classList.add("inactive");
  showDescription.classList.add("inactive");
  genreSearch.classList.add("inactive");
  searchSection.classList.add("inactive");
  favoritesSection.classList.add("inactive");
  navbar.classList.remove("inactive");

  navDiscover.classList.add("currentNav");
  navSearch.classList.remove("currentNav");
  navTrend.classList.remove("currentNav");
  navAbout.classList.remove("currentNav");

  getTrendingTv();
  getFavoriteItemsMain()
  getTrendingMovies();
  getTrendingPeople();
  getGenresMovies(); 
  getPopularMovies();
  getPopularTv();
  getUpcomingMovies();
  getTopShows();
  getTopMovies();
}

function searchPage() {
  arrowBtn.classList.add("inactive");
  headerTitle.classList.remove("inactive");

  trendingTv.classList.add("inactive");
  favorites.classList.add("inactive");
  trendingMovies.classList.add("inactive");
  trendingPeople.classList.add("inactive");
  genres.classList.add("inactive");
  popularMovies.classList.add("inactive");
  popularTv.classList.add("inactive");
  upcomingMovies.classList.add("inactive");
  topShow.classList.add("inactive");
  topMovie.classList.add("inactive");
  aboutSection.classList.add("inactive");

  showDescription.classList.add("inactive");
  genreSearch.classList.add("inactive");
  searchSection.classList.remove("inactive");
  favoritesSection.classList.add("inactive");
  navbar.classList.remove("inactive");

  navDiscover.classList.remove("currentNav");
  navSearch.classList.add("currentNav");
  navTrend.classList.remove("currentNav");
  navAbout.classList.remove("currentNav");

  searching();
  const [_, query] = location.hash.split("="); // ["#search", "query"]
  query == "" ? getPopularAll() : getItemBySearch(query);

  infiniteScroll = query == "" ? getNewPopular : getNewPagesSearch;
}

function favoritesPage() {
  arrowBtn.classList.add("inactive");
  headerTitle.classList.add("inactive");

  trendingTv.classList.add("inactive");
  favorites.classList.add("inactive");
  trendingMovies.classList.add("inactive");
  trendingPeople.classList.add("inactive");
  genres.classList.add("inactive");
  popularMovies.classList.add("inactive");
  popularTv.classList.add("inactive");
  upcomingMovies.classList.add("inactive");
  topShow.classList.add("inactive");
  topMovie.classList.add("inactive");
  aboutSection.classList.add("inactive");

  showDescription.classList.add("inactive");
  genreSearch.classList.add("inactive");
  searchSection.classList.add("inactive");
  favoritesSection.classList.remove("inactive");
  navbar.classList.remove("inactive");

  navDiscover.classList.remove("currentNav");
  navSearch.classList.remove("currentNav");
  navTrend.classList.add("currentNav");
  navAbout.classList.remove("currentNav");

  getFavoriteItemsSection()
}

function aboutPage() {
  arrowBtn.classList.add("inactive");
  headerTitle.classList.add("inactive");

  trendingTv.classList.add("inactive");
  favorites.classList.add("inactive");
  trendingMovies.classList.add("inactive");
  trendingPeople.classList.add("inactive");
  genres.classList.add("inactive");
  popularMovies.classList.add("inactive");
  popularTv.classList.add("inactive");
  upcomingMovies.classList.add("inactive");
  topShow.classList.add("inactive");
  topMovie.classList.add("inactive");
  aboutSection.classList.remove("inactive");

  showDescription.classList.add("inactive");
  genreSearch.classList.add("inactive");
  searchSection.classList.add("inactive");
  favoritesSection.classList.add("inactive");
  navbar.classList.remove("inactive");

  navDiscover.classList.remove("currentNav");
  navSearch.classList.remove("currentNav");
  navTrend.classList.remove("currentNav");
  navAbout.classList.add("currentNav");
}

function movieShowDetail() {
  arrowBtn.classList.remove("inactive");
  headerTitle.classList.add("inactive");

  trendingTv.classList.add("inactive");
  favorites.classList.add("inactive");
  trendingMovies.classList.add("inactive");
  trendingPeople.classList.add("inactive");
  genres.classList.add("inactive");
  popularMovies.classList.add("inactive");
  popularTv.classList.add("inactive");
  upcomingMovies.classList.add("inactive");
  topShow.classList.add("inactive");
  topMovie.classList.add("inactive");
  navbar.classList.remove("inactive");
  aboutSection.classList.add("inactive");

  showDescription.classList.remove("inactive");
  genreSearch.classList.add("inactive");
  searchSection.classList.add("inactive");
  favoritesSection.classList.add("inactive");

  const [_, showData] = location.hash.split("="); // ["#movie=", "id-type"]
  const [showId, type] = showData.split("-");

  if (type === "movie") {
    getMovieById(showId);
  } else {
    getTvById(showId);
  }
}

function categoriesPage() {
  arrowBtn.classList.remove("inactive");
  headerTitle.classList.add("inactive");

  trendingTv.classList.add("inactive");
  favorites.classList.add("inactive");
  trendingMovies.classList.add("inactive");
  trendingPeople.classList.add("inactive");
  genres.classList.add("inactive");
  popularMovies.classList.add("inactive");
  popularTv.classList.add("inactive");
  upcomingMovies.classList.add("inactive");
  topShow.classList.add("inactive");
  topMovie.classList.add("inactive");
  navbar.classList.remove("inactive");
  aboutSection.classList.add("inactive");

  showDescription.classList.add("inactive");
  genreSearch.classList.remove("inactive");
  searchSection.classList.add("inactive");
  favoritesSection.classList.add("inactive");

  const [_, categoryData] = location.hash.split("="); // ["#category", "id-name-type"]
  const [categoryId, categoryName, type] = categoryData.split("-");

  genreTitles.setAttribute("id", `id${categoryId}`);
  //elimina los %20 que salen para recrear espacios por el URI
  genreTitles.innerHTML = decodeURI(categoryName);

  type == "movie" ? getProductByCategoryMovie() : getProductByCategoryTv();
  infiniteScroll = type == "movie" ? getNewPagesMovies : getNewPagesTv;
}

//SEARCH LISTENER ----------------------------------------

function searching() {
  // event.preventDefault
  location.hash = `#search=${searchInput.value.trim()}`;
}

// window.addEventListener("load", () => {
//   searchInput.addEventListener("change", (query) =>{
//    location.hash = `#search=${query.target.value}`
//    console.log(query.target.value)
//   })
// })
