const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: API_KEY,
  },
});

// UTILS

//no option after callback because i'm aiming for the whole document
const lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const url = entry.target.getAttribute("data-img");
      entry.target.setAttribute("src", url);
    }
  });
});

const getAndAppendWithIndex = async (
  path,
  parentContainer,
  section,
  byname
) => {
  try {
    const { data } = await api(path);
    const item = data.results;
    section.innerHTML = "";

    item.forEach((show, index) => {
      const itemContainer = document.createElement("div");
      itemContainer.classList.add(parentContainer);

      itemContainer.addEventListener("click", () => {
        location.hash = `#movie=${show.id}-${show.media_type}`;
      });

      const itemImg = document.createElement("img");
      itemImg.classList.add("item-img");

      byname == "name"
        ? itemImg.setAttribute("alt", show.name)
        : itemImg.setAttribute("alt", show.title);

      itemImg.setAttribute(
        "data-img",
        `https://image.tmdb.org/t/p/w300${show.poster_path}`
      );

      //escucha mi objeto
      lazyLoader.observe(itemImg);

      const itemSpan = document.createElement("span");
      itemSpan.classList.add("item-number");
      itemSpan.textContent = index + 1;

      itemContainer.appendChild(itemSpan);
      itemContainer.appendChild(itemImg);
      section.appendChild(itemContainer);
    });
  } catch (err) {
    console.error(err);
  }
};

//TRENDING ------------------------------

const getTrendingTv = () => {
  getAndAppendWithIndex(
    "/trending/tv/day",
    "tv-container",
    trendingTvList,
    "name"
  );
};

const getTrendingMovies = () => {
  getAndAppendWithIndex(
    "/trending/movie/day",
    "movie-container",
    trendingMovieList,
    "title"
  );
};

const appendPeople = async (path, section, castOrResult) => {
  try {
    const { data } = await api(path);
    let person = "";

    castOrResult === "result" ? (person = data.results) : (person = data.cast);
    section.innerHTML = "";
    person.forEach((person) => {
      const peopleContainer = document.createElement("div");
      peopleContainer.classList.add("people-container");

      const personImg = document.createElement("img");
      personImg.classList.add("people-img");
      personImg.setAttribute("alt", person.name);
      if (person.profile_path === null) {
        peopleContainer.classList.add("missing-person");
      } else {
        personImg.setAttribute(
          "data-img",
          `https://image.tmdb.org/t/p/w185${person.profile_path}`
        );
      }

      lazyLoader.observe(personImg);

      const personSpan = document.createElement("span");
      personSpan.classList.add("people-name");
      personSpan.textContent = person.name;

      peopleContainer.appendChild(personSpan);
      peopleContainer.appendChild(personImg);
      section.appendChild(peopleContainer);
    });
  } catch (err) {
    console.error(err);
  }
};

const getTrendingPeople = async () => {
  appendPeople("/trending/person/day", trendingPeopleList, "result");
};

//GENRES----------------------------------

const getGenres = async (path, parentContainer, section, type) => {
  try {
    const { data } = await api(path);
    const genre = data.genres;
    section.innerHTML = "";
    genre.forEach((genre) => {
      const genreContainer = document.createElement("div");
      genreContainer.classList.add(parentContainer);

      const genreName = document.createElement("h3");
      genreName.classList.add("category-title");
      genreName.setAttribute("id", `id${genre.id}`);
      genreName.addEventListener(
        "click",
        () => (location.hash = `#category=${genre.id}-${genre.name}-${type}`)
      );

      genreName.textContent = genre.name;

      genreContainer.appendChild(genreName);
      section.appendChild(genreContainer);
    });
  } catch (err) {
    console.error(err);
  }
};

const getGenresMovies = () => {
  getGenres("/genre/movie/list", "category-container", genreMovieList, "movie");
};

const getGenresTv = () => {
  getGenres("/genre/tv/list", "category-container", genreMovieList, "tv");
};

// TOGGLE GENRES BUTTONS

const bringTv = () => {
  const genreContainer = document.querySelector(".genres-list");
  const notCurrentButton = document.querySelector(".genres-movie");
  const currentButton = document.querySelector(".genres-tv");

  notCurrentButton.classList.add("notCurrent-genre__button");
  notCurrentButton.removeAttribute("disabled");
  currentButton.classList.remove("notCurrent-genre__button");
  currentButton.setAttribute("disabled", "disabled");
  genreContainer.innerHTML = "";
  getGenresTv();
};

const bringMovie = () => {
  const genreContainer = document.querySelector(".genres-list");
  const notCurrentButton = document.querySelector(".genres-tv");
  const currentButton = document.querySelector(".genres-movie");

  notCurrentButton.classList.add("notCurrent-genre__button");
  notCurrentButton.removeAttribute("disabled");
  currentButton.classList.remove("notCurrent-genre__button");
  currentButton.setAttribute("disabled", "disabled");
  genreContainer.innerHTML = "";
  getGenresMovies();
};

const getNetworksImg = async () => {
  try {
    const networksId = [213, 1024, 49, 2739, 2552, 453, 303, 67];
    networksList.innerHTML = "";
    networksId.forEach(async (item) => {
      const { data } = await api(`/network/${item}`);

      const networkContainer = document.createElement("div");
      networkContainer.classList.add("network-container");

      const networkImg = document.createElement("img");
      networkImg.classList.add("network-img");
      networkImg.setAttribute("alt", data.name);
      networkImg.setAttribute(
        "data-img",
        `https://image.tmdb.org/t/p/w92${data.logo_path}`
      );

      lazyLoader.observe(networkImg);

      networkContainer.appendChild(networkImg);
      networksList.appendChild(networkContainer);
    });
  } catch (err) {
    console.error(err);
  }
};

//MISCELLANEOUS SECTION ---------------------

const getAndAppend = async (
  path,
  parentContainer,
  section,
  byname,
  optionalConfig = {},
  { isInfinite = false, clean = true } = {}
) => {
  try {
    const { data } = await api(path, optionalConfig);
    const generic = data.results;
    maxPage = data.total_pages;

    if (clean) {
      section.innerHTML = "";
      page = 1;
    }

    generic.forEach((show) => {
      const genericContainer = document.createElement("div");
      genericContainer.classList.add(`${parentContainer}-container`);

      genericContainer.addEventListener("click", () => {
        show.name === undefined
          ? (location.hash = `#movie=${show.id}-movie`)
          : (location.hash = `#movie=${show.id}-tv`);
      });

      const genericImg = document.createElement("img");
      genericImg.classList.add(`${parentContainer}-img`);

      //checks if it is an actor or a show to set alt
      if (show.name === undefined) {
        genericImg.setAttribute("alt", show.title);
      } else if (show.title === undefined) {
        genericImg.setAttribute("alt", show.name);
      }

      //checks if it is an actor or a show to set the img
      if (show.media_type === "person") {
        if (show.profile_path === null) {
          genericContainer.classList.add("missing-data");
        } else {
          genericImg.setAttribute(
            "data-img",
            `https://image.tmdb.org/t/p/w185${show.profile_path}`
          );
          genericContainer.classList.add(
            `${parentContainer}-container__gradient`
          );
        }

        const personSpan = document.createElement("span");
        personSpan.classList.add("people-name");
        personSpan.textContent = show.name;
        genericContainer.appendChild(personSpan);
      } else {
        if (show.poster_path === null) {
          genericContainer.classList.add("missing-data");
        } else {
          genericImg.setAttribute(
            "data-img",
            `https://image.tmdb.org/t/p/w300${show.poster_path}`
          );
        }
      }
      // lazy loading
      lazyLoader.observe(genericImg);

      genericContainer.appendChild(genericImg);
      section.appendChild(genericContainer);
    });

    //infinite loading

    // if (isInfinite) {
    // const btnLoadMore = document.createElement("button");
    // btnLoadMore.innerHTML = "Load More";
    // section.appendChild(btnLoadMore);

    // }
  } catch (err) {
    console.error(err);
  }
};

const getPopularMovies = () => {
  getAndAppend("/movie/popular", "generic", popularMovieList, "title");
};

const getPopularTv = () => {
  getAndAppend("/tv/popular", "generic", popularTvList, "name");
};

const getUpcomingMovies = () => {
  getAndAppend("/movie/upcoming", "generic", upcomingMoviesList, "title");
};

const getTopShows = () => {
  getAndAppend("/tv/top_rated", "generic", topShowList, "name");
};

const getTopMovies = () => {
  getAndAppend("/movie/top_rated", "generic", topMovieList, "title");
};

const getPopularAll = () => {
  getAndAppend(
    "/trending/all/day",
    "catalogue",
    popularAllList,
    "name",
    {
      params: { page: page },
    },
    { isInfinite: true, clean: true }
  );
};

// GET INFINITE ITEMS

let currentQuery;

//para evitar usar doble funcion para evitar enviar parametros desde el navigation.js podemos usar closures. Ej: getProductByCategoryMovie(id){ return async function(){...code..}}

const getNewPagesMovies = () => {
  const [_, categoryData] = location.hash.split("="); // ["#category", "id-name-type"]
  const [categoryId, categoryName, type] = categoryData.split("-");

  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  const scrollAtBottom = scrollTop + clientHeight >= scrollHeight - 15;
  const limitPages = page < maxPage;

  if (scrollAtBottom && limitPages) {
    page++;
    getAndAppend(
      "/discover/movie",
      "catalogue",
      genreList,
      "name",
      {
        params: { with_genres: categoryId, page: page },
      },
      { isInfinite: true, clean: false }
    );
  }
};

const getNewPagesTv = () => {
  const [_, categoryData] = location.hash.split("="); // ["#category", "id-name-type"]
  const [categoryId, categoryName, type] = categoryData.split("-");

  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  const scrollAtBottom = scrollTop + clientHeight >= scrollHeight - 15;
  const limitPages = page < maxPage;

  if (scrollAtBottom && limitPages) {
    page++;
    getAndAppend(
      "/discover/tv",
      "catalogue",
      genreList,
      "name",
      {
        params: { with_genres: categoryId, page: page },
      },
      { isInfinite: true, clean: false }
    );
  }
};

const getNewPagesSearch = () => {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  const scrollAtBottom = scrollTop + clientHeight >= scrollHeight - 15;
  const limitPages = page < maxPage;

  if (scrollAtBottom && limitPages) {
    page++;

    getAndAppend(
      "/search/multi",
      "catalogue",
      popularAllList,
      "name",
      {
        params: { query: currentQuery, page: page },
      },
      { isInfinite: true, clean: false }
    );
  }
};

const getNewPopular = () => {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  const scrollAtBottom = scrollTop + clientHeight >= scrollHeight - 15;
  const limitPages = page < maxPage;

  page++;
  if (scrollAtBottom && limitPages) {
    getAndAppend(
      "/trending/all/day",
      "catalogue",
      popularAllList,
      "name",
      {
        params: { page: page },
      },
      { isInfinite: true, clean: false }
    );
  }
};

// GENRES CATEGORIES

const getProductByCategoryMovie = () => {
  const [_, categoryData] = location.hash.split("="); // ["#category", "id-name-type"]
  const [categoryId, categoryName, type] = categoryData.split("-");

  getAndAppend(
    "/discover/movie",
    "catalogue",
    genreList,
    "name",
    {
      params: { with_genres: categoryId },
    },
    { isInfinite: true, clean: true }
  );
};

const getProductByCategoryTv = () => {
  const [_, categoryData] = location.hash.split("="); // ["#category", "id-name-type"]
  const [categoryId, categoryName, type] = categoryData.split("-");

  getAndAppend(
    "/discover/tv",
    "catalogue",
    genreList,
    "name",
    {
      params: { with_genres: categoryId },
    },
    { isInfinite: true, clean: true }
  );
};

const getItemBySearch = (query) => {
  currentQuery = query;
  getAndAppend("/search/multi", "catalogue", popularAllList, "name", {
    params: { query },
  });
};

// DETAILED DATA OF THE MOVIE SHOW SELECTED

const getMovieById = async () => {
  const [_, categoryData] = location.hash.split("="); // ["#category", "id-name-type"]
  const [categoryId, categoryName, type] = categoryData.split("-");

  const { data: movie } = await api(`/movie/${categoryId}`);
  showDirector.innerHTML = "";
  showCompanies.innerHTML = "";
  showNetworkLogo.removeAttribute("src");

  showPortrait.setAttribute(
    "src",
    `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
  );
  showTitle.textContent = movie.title;
  showDate.textContent = movie.release_date;
  showGenre.textContent = movie.genres[0].name;
  showResume.textContent = movie.overview;
  showScore.textContent = `${movie.vote_average}✨`;

  showLength.textContent = `${movie.runtime}m`;
  //directos--credits
  showOTitle.textContent = movie.original_title;

  const h5companies = document.createElement("h5");
  h5companies.textContent = "Production Companies";
  showCompanies.appendChild(h5companies);

  movie.production_companies.forEach((item) => {
    const span = document.createElement("span");
    span.textContent = item.name;
    showCompanies.appendChild(span);
  });

  getCastMovie(categoryId);
  getGenres(`/movie/${categoryId}`, ".genres-list", showRelatedGenres, "movie");
  getSimilarMovies(categoryId);
  getRecommendedMovies(categoryId);
};

// DETAILED DATA OF THE TV SHOW SELECTED
const getTvById = async () => {
  const [_, categoryData] = location.hash.split("="); // ["#category", "id-name-type"]
  const [categoryId, categoryName, type] = categoryData.split("-");

  const { data: tv } = await api(`/tv/${categoryId}`);
  showDirector.innerHTML = "";
  showCompanies.innerHTML = "";

  showPortrait.setAttribute(
    "src",
    `https://image.tmdb.org/t/p/w780${tv.backdrop_path}`
  );
  showTitle.textContent = tv.name;
  showDate.textContent = tv.first_air_date;
  showGenre.textContent = tv.genres[0].name;
  showResume.textContent = tv.overview;
  showScore.textContent = `${tv.vote_average}✨`;
  showNetworkLogo.setAttribute(
    "src",
    `https://image.tmdb.org/t/p/w92${tv.networks[0].logo_path}`
  );
  showLength.textContent = `${tv.episode_run_time[0]}m`;

  const h5 = document.createElement("h5");
  h5.classList.add(".info-creator");
  h5.textContent = "Creators";

  showDirector.append(h5);

  tv.created_by.forEach((item) => {
    const span = document.createElement("span");
    span.textContent = item.name;
    showDirector.appendChild(span);
  });

  showOTitle.textContent = tv.original_name;

  const h5companies = document.createElement("h5");
  h5companies.textContent = "Production Companies";
  showCompanies.appendChild(h5companies);

  tv.production_companies.forEach((item) => {
    const span = document.createElement("span");
    span.textContent = item.name;
    showCompanies.appendChild(span);
  });

  getCastTv(categoryId);
  getGenres(`/tv/${categoryId}`, ".genres-list", showRelatedGenres, "tv");
  getSimilarTv(categoryId);
  getRecommendedTv(categoryId);
};

// DATA OF ITEM SELECTED
const getSimilarMovies = async (id) => {
  getAndAppend(`/movie/${id}/similar`, "related", similarList);
};

const getRecommendedMovies = async (id) => {
  getAndAppend(`/movie/${id}/recommendations`, "related", recomendList);
};

const getSimilarTv = async (id) => {
  getAndAppend(`/tv/${id}/similar`, "related", similarList);
};

const getRecommendedTv = async (id) => {
  getAndAppend(`/tv/${id}/recommendations`, "related", recomendList);
};

const getCastMovie = async (id) => {
  appendPeople(`/movie/${id}/credits`, castList, "cast");
};

const getCastTv = async (id) => {
  appendPeople(`/tv/${id}/credits`, castList, "cast");
};
