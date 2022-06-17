const $ = (id) => document.querySelector(id);

// header section ----------------------------------------------------

const header = $("#header");
const arrowBtn = $(".header-arrow");
const headerTitle = $(".header-title");

// navbar ------------------------------------------------------------

//Sections -----------------------------------------------------------

const trendingTv = $("#trendingTv");
const networks = $("#networks");
const trendingMovies = $("#trendingMovies");
const trendingPeople = $("#trendingPeople");
const genres = $("#genres");
const popularMovies = $("#popularMovies-list");
const popularTv = $("#popularTv-list");
const upcomingMovies = $("#upcomingMovies");
const topShow = $("#topShow");
const topMovie = $("#topMovie");
const showDescription = $("#show-description");
const genreSearch = $("#genre-search");
const searchSection = $("#popularAll")
const trendingMenu = $("#trending-Section")

//navbar section ---------------------------------------------------

const navbar = $(".navbar")
const navDiscover = $("#nav-discover")
const navSearch = $("#nav-search")
const navTrend = $("#nav-trend")
const navAbout = $("#nav-about")

//Trend Section ----------------------------------------------------

const trendMovies = $(".trend-movies")
const trendTv = $(".trend-tv")
const trendMovGen = $(".trend-m-genres")
const trendTvGen = $(".trend-tv-genres")
const trendPeople = $(".trend-people")
const trendAll = $(".trend-all")

//List ---------------------------------------------------------

const trendingTvList = $("#trendingTv .trendingTv-List")
const trendingMovieList = $("#trendingMovies .trendingMovies-List")
const trendingPeopleList = $("#trendingPeople .people-List")
const networksList =  $("#networks .networks-List")
const popularMovieList = $("#popularMovies-list .generic-List")
const popularTvList = $("#popularTv-list .generic-List")
const upcomingMoviesList = $("#upcomingMovies .generic-List")
const topShowList = $("#topShow .generic-List")
const topMovieList = $("#topMovie .generic-List")
const popularAllList = $("#popularAll .catalogue__List")

const genreMovieList = $("#genres .genres-list")
const genreList = $("#genre-search .catalogue__List")

//Elements ----------------------------------------
const genreTitles = $(".catalogue-title")
const searchInput = $(".group .input")