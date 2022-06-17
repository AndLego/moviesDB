//Navbar Listeners ----------------------------

navDiscover.addEventListener("click", () => (location.hash = "#home"));
navSearch.addEventListener("click", () => {(location.hash = "#search=")});
navTrend.addEventListener("click", () => (location.hash = "#trends"));
navAbout.addEventListener("click", () => (location.hash = "#about"));

arrowBtn.addEventListener("click", () => (location.hash = "#home"));

//Trends Listener ----------------------------------------------------------------

trendMovies.addEventListener("click", () => (location.hash = "#trends=movies"));
trendTv.addEventListener("click", () => (location.hash = "#trends=tv"));
trendMovGen.addEventListener(
  "click",
  () => (location.hash = "#trends=m-genres")
);
trendTvGen.addEventListener(
  "click",
  () => (location.hash = "#trends=tv-genres")
);
trendPeople.addEventListener("click", () => (location.hash = "#trends=people"));
trendAll.addEventListener("click", () => (location.hash = "#trends=all"));

//General---------------------------------------------------

window.addEventListener("DOMContentLoaded", navigator, false);
window.addEventListener("hashchange", navigator, false);

function navigator() {
  location.hash.startsWith("#home")
    ? discover()
    : location.hash.startsWith("#search=")
    ? searchPage()
    : location.hash.startsWith("#trends")
    ? trendsPage()
    : location.hash.startsWith("#about")
    ? aboutPage()
    : location.hash.startsWith("#movie=")
    ? movieDetailPage()
    : location.hash.startsWith("#category=")
    ? categoriesPage()
    : discover();

    smoothscroll()
} 

function smoothscroll(){
  const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
  if (currentScroll > 0) {
       window.requestAnimationFrame(smoothscroll);
       window.scrollTo (0,currentScroll - (currentScroll/5));
  }
};

function discover() {
  console.log("home");

  arrowBtn.classList.add("inactive");
  headerTitle.classList.remove("inactive");

  trendingTv.classList.remove("inactive");
  networks.classList.remove("inactive");
  trendingMovies.classList.remove("inactive");
  trendingPeople.classList.remove("inactive");
  genres.classList.remove("inactive");
  popularMovies.classList.remove("inactive");
  popularTv.classList.remove("inactive");
  upcomingMovies.classList.remove("inactive");
  topShow.classList.remove("inactive");
  topMovie.classList.remove("inactive");

  showDescription.classList.add("inactive");
  genreSearch.classList.add("inactive");
  searchSection.classList.add("inactive");
  trendingMenu.classList.add("inactive");
  navbar.classList.remove("inactive");

  navDiscover.classList.add("currentNav");
  navSearch.classList.remove("currentNav");
  navTrend.classList.remove("currentNav");
  navAbout.classList.remove("currentNav");

  getTrendingTv();
  getTrendingMovies();
  getTrendingPeople();
  getGenresMovies(); //generar una funcion que encapsule ambos y usar true/false
  // getGenresTv();
  getNetworksImg();
  getPopularMovies();
  getPopularTv();
  getUpcomingMovies();
  getTopShows();
  getTopMovies();
}

function searchPage() {
  console.log("searching!");

  arrowBtn.classList.add("inactive");
  headerTitle.classList.remove("inactive");

  trendingTv.classList.add("inactive");
  networks.classList.add("inactive");
  trendingMovies.classList.add("inactive");
  trendingPeople.classList.add("inactive");
  genres.classList.add("inactive");
  popularMovies.classList.add("inactive");
  popularTv.classList.add("inactive");
  upcomingMovies.classList.add("inactive");
  topShow.classList.add("inactive");
  topMovie.classList.add("inactive");

  showDescription.classList.add("inactive");
  genreSearch.classList.add("inactive");
  searchSection.classList.remove("inactive");
  trendingMenu.classList.add("inactive");
  navbar.classList.remove("inactive");

  navDiscover.classList.remove("currentNav");
  navSearch.classList.add("currentNav");
  navTrend.classList.remove("currentNav");
  navAbout.classList.remove("currentNav");

  const [_, query] = location.hash.split("="); // ["#search", "query"]
  getItemBySearch(query)

  getPopularAll();
}

function trendsPage() {
  arrowBtn.classList.add("inactive");
  headerTitle.classList.add("inactive");

  trendingTv.classList.add("inactive");
  networks.classList.add("inactive");
  trendingMovies.classList.add("inactive");
  trendingPeople.classList.add("inactive");
  genres.classList.add("inactive");
  popularMovies.classList.add("inactive");
  popularTv.classList.add("inactive");
  upcomingMovies.classList.add("inactive");
  topShow.classList.add("inactive");
  topMovie.classList.add("inactive");

  showDescription.classList.add("inactive");
  genreSearch.classList.add("inactive");
  searchSection.classList.add("inactive");
  trendingMenu.classList.remove("inactive");
  navbar.classList.remove("inactive");

  navDiscover.classList.remove("currentNav");
  navSearch.classList.remove("currentNav");
  navTrend.classList.add("currentNav");
  navAbout.classList.remove("currentNav");
}

function aboutPage() {
  arrowBtn.classList.add("inactive");
  headerTitle.classList.add("inactive");

  trendingTv.classList.add("inactive");
  networks.classList.add("inactive");
  trendingMovies.classList.add("inactive");
  trendingPeople.classList.add("inactive");
  genres.classList.add("inactive");
  popularMovies.classList.add("inactive");
  popularTv.classList.add("inactive");
  upcomingMovies.classList.add("inactive");
  topShow.classList.add("inactive");
  topMovie.classList.add("inactive");

  showDescription.classList.add("inactive");
  genreSearch.classList.add("inactive");
  searchSection.classList.add("inactive");
  trendingMenu.classList.add("inactive");
  navbar.classList.remove("inactive");

  navDiscover.classList.remove("currentNav");
  navSearch.classList.remove("currentNav");
  navTrend.classList.remove("currentNav");
  navAbout.classList.add("currentNav");
}

function movieDetailPage() {
  console.log("movie!");

  arrowBtn.classList.remove("inactive");
  headerTitle.classList.add("inactive");

  trendingTv.classList.add("inactive");
  networks.classList.add("inactive");
  trendingMovies.classList.add("inactive");
  trendingPeople.classList.add("inactive");
  genres.classList.add("inactive");
  popularMovies.classList.add("inactive");
  popularTv.classList.add("inactive");
  upcomingMovies.classList.add("inactive");
  topShow.classList.add("inactive");
  topMovie.classList.add("inactive");
  navbar.classList.add("inactive");

  showDescription.classList.remove("inactive");
  genreSearch.classList.add("inactive");
  searchSection.classList.add("inactive");
  trendingMenu.classList.add("inactive");
}

function categoriesPage() {
  console.log("categories!");

  arrowBtn.classList.remove("inactive");
  headerTitle.classList.add("inactive");

  trendingTv.classList.add("inactive");
  networks.classList.add("inactive");
  trendingMovies.classList.add("inactive");
  trendingPeople.classList.add("inactive");
  genres.classList.add("inactive");
  popularMovies.classList.add("inactive");
  popularTv.classList.add("inactive");
  upcomingMovies.classList.add("inactive");
  topShow.classList.add("inactive");
  topMovie.classList.add("inactive");
  navbar.classList.add("inactive");

  showDescription.classList.add("inactive");
  genreSearch.classList.remove("inactive");
  searchSection.classList.add("inactive");
  trendingMenu.classList.add("inactive");

  const [_, categoryData] = location.hash.split("="); // ["#category", "id-name-type"]
  const [categoryId, categoryName, type] = categoryData.split("-");

  genreTitles.setAttribute("id", `id${categoryId}`);
  genreTitles.innerHTML = decodeURI(categoryName);

  type == "movie"
    ? getProductByCategoryMovie(categoryId)
    : getProductByCategoryTv(categoryId);
}

//SEARCH LISTENER ----------------------------------------

function searching() {
  event.preventDefault
  location.hash = `#search=${searchInput.value}`
}

// window.addEventListener("load", () => {
//   searchInput.addEventListener("change", (query) =>{
//    location.hash = `#search=${query.target.value}`
//    console.log(query)
//   })
// })