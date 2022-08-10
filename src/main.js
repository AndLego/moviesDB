// DATA

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: API_KEY,
  },
});

const likedItemList = () => {
  const item = JSON.parse(localStorage.getItem("liked_items"));
  let items;

  item ? (items = item) : (items = {});

  return items;
};

/**
 * It takes an item as an argument, and then it either adds it to the liked items list or removes it
 * from the liked items list
 * @param item - The item to be liked or unliked.
 */
const likeItem = (item) => {
  const likedItems = likedItemList();
  if (likedItems[item.id]) {
    likedItems[item.id] = undefined;
    // localStorage.removeItem('item')
  } else {
    likedItems[item.id] = item;
    // localStorage.setItem(item.id, )
  }
  localStorage.setItem("liked_items", JSON.stringify(likedItems));
};

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

/**
 * It takes in a path, a parent container, a section, and a byname parameter, and then it uses the path
 * to make an API request, and then it uses the parent container, section, and byname parameters to
 * create a div, an image, a span, and a button, and then it appends the div, image, span, and button
 * to the section
 * @param path - the path to the API request
 * @param parentContainer - the class name of the container that will hold the image, the number, and
 * the like button.
 * @param section - the section where the items will be appended
 * @param byname - this is a string that is either "name" or "title" depending on whether the API
 * request is for a movie or a tv show.
 */
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

      const itemImg = document.createElement("img");
      itemImg.classList.add("item-img");
      itemImg.addEventListener("click", () => {
        location.hash = `#movie=${show.id}-${show.media_type}`;
      });

      //tv and movies have a different API request for the name
      byname == "name"
        ? itemImg.setAttribute("alt", show.name)
        : itemImg.setAttribute("alt", show.title);

      itemImg.setAttribute(
        "data-img",
        `https://image.tmdb.org/t/p/w300${show.poster_path}`
        // para favorites `https://image.tmdb.org/t/p/w185${show.poster_path}`
      );

      //escucha mi objeto
      lazyLoader.observe(itemImg);

      const itemSpan = document.createElement("span");
      itemSpan.classList.add("item-number");
      itemSpan.textContent = index + 1;

      const likeBtn = document.createElement("button");
      likeBtn.classList.add("like-btn");
      likeBtn.innerHTML = `<i class="fa-solid fa-heart"></i>`;

      likedItemList()[show.id] && likeBtn.classList.add("delete-favorite");

      likeBtn.addEventListener("click", () => {
        likeBtn.classList.toggle("delete-favorite");
        likeItem(show);
        getFavoriteItemsMain();
      });

      itemContainer.append(itemSpan, itemImg, likeBtn);
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

/**
 * It takes in a path, a section, and a string that determines whether to use the data.cast or
 * data.results property. It then creates a div, an img, and a span element, and appends them to the
 * section
 * @param path - the path to the api
 * @param section - the section where the people will be appended to
 * @param castOrResult - This is a string that is either "cast" or "result". This is used to determine
 * whether the data is coming from the cast or the result.
 */
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
        personImg.classList.add("missing-data");
        personImg.setAttribute(
          "data-img",
          "https://icon-library.com/images/not-found-icon/not-found-icon-6.jpg"
        );
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

/**
 * It takes in a path, a parent container, a section, and a type, and then it fetches the data from the
 * API, creates a genre container, creates a genre name, and then appends the genre name to the genre
 * container, and then appends the genre container to the section
 * @param path - the path to the API endpoint
 * @param parentContainer - the class name of the parent container
 * @param section - the section where the genres will be displayed
 * @param type - movie or tv
 */
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

//MISCELLANEOUS SECTION ---------------------

/**
 * It takes in a path, a parent container, a section, a byname, an optional config, and an object with
 * two properties, isInfinite and clean, and returns a promise that resolves to the data from the api
 * call
 * @param path - the path to the API
 * @param parentContainer - the name of the container that will be created
 * @param section - the section where the results will be appended
 * @param byname - is a boolean that checks if the search is by name or not.
 * @param [optionalConfig] - this is an object that can be passed to the function to add more
 * parameters to the API call.
 * @param [] - path: the path to the API
 */
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

    let showAlt;

    if (clean) {
      section.innerHTML = "";
      page = 1;
    }

    generic.forEach((show) => {
      if (show.media_type !== "person") {
        const genericContainer = document.createElement("div");
        genericContainer.classList.add(`${parentContainer}-container`);

        const genericImg = document.createElement("img");
        genericImg.classList.add(`${parentContainer}-img`);
        genericImg.addEventListener("click", () => {
          show.name === undefined
            ? (location.hash = `#movie=${show.id}-movie`)
            : (location.hash = `#movie=${show.id}-tv`);
        });
        //checks if it is an actor or a show to set alt
        if (show.name === undefined) {
          genericImg.setAttribute("alt", show.title);
          showAlt = show.title;
        } else if (show.title === undefined) {
          genericImg.setAttribute("alt", show.name);
          showAlt = show.name;
        }
        //checks if it is an actor or a show to set the img
        if (show.media_type === "person") {
          if (show.profile_path === null) {
            genericImg.classList.add("missing-data");
            genericImg.setAttribute(
              "data-img",
              "https://icon-library.com/images/not-found-icon/not-found-icon-6.jpg"
            );
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
            genericImg.setAttribute(
              "data-img",
              "https://icon-library.com/images/light-icon-png/light-icon-png-21.jpg"
            );
            const foundAlt = document.createElement("span");
            foundAlt.classList.add("altShowDescription");
            foundAlt.textContent = showAlt;

            foundAlt.addEventListener("click", () => {
              show.name === undefined
                ? (location.hash = `#movie=${show.id}-movie`)
                : (location.hash = `#movie=${show.id}-tv`);
            });

            genericContainer.appendChild(foundAlt);
          } else {
            genericImg.setAttribute(
              "data-img",
              `https://image.tmdb.org/t/p/w300${show.poster_path}`
            );
          }
        }
        // lazy loading
        lazyLoader.observe(genericImg);

        const likeBtn = document.createElement("button");
        likeBtn.classList.add("like-btn");
        likeBtn.innerHTML = `<i class="fa-solid fa-heart"></i>`;

        likedItemList()[show.id] && likeBtn.classList.add("delete-favorite");

        likeBtn.addEventListener("click", () => {
          likeBtn.classList.toggle("delete-favorite");
          likeItem(show);
          getFavoriteItemsMain();
        });

        genericContainer.append(genericImg, likeBtn);
        section.appendChild(genericContainer);
      }
    });
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
  const [categoryId] = categoryData.split("-");

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

/**
 * It gets the movie data from the API and displays it on the page
 */
const getMovieById = async () => {
  const [_, categoryData] = location.hash.split("="); // ["#category", "id-name-type"]
  const [categoryId, categoryName, type] = categoryData.split("-");

  const { data: movie } = await api(`/movie/${categoryId}`);
  showDirector.innerHTML = "";
  showCompanies.innerHTML = "";
  showNetworkLogo.removeAttribute("src");

  if (movie.backdrop_path === null) {
    showPortrait.setAttribute(
      "src",
      "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png"
    );
  } else {
    showPortrait.setAttribute(
      "src",
      `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
    );
  }
  showTitle.textContent = movie.title;
  showDate.textContent = movie.release_date;
  movie.genres.length == 0
    ? (showGenre.textContent = "-")
    : (showGenre.textContent = movie.genres[0].name);

  showResume.textContent = movie.overview;
  showScore.textContent = `${movie.vote_average}✨`;

  showLength.textContent = `${movie.runtime}m`;
  showOTitle.textContent = movie.original_title;

  const h5companies = document.createElement("h5");
  h5companies.textContent = "Production Companies";
  showCompanies.appendChild(h5companies);

  movie.production_companies.forEach((item) => {
    const span = document.createElement("span");
    span.textContent = item.name;
    showCompanies.appendChild(span);
  });

  getGenres(`/movie/${categoryId}`, ".genres-list", showRelatedGenres, "movie");
  getCastMovie(categoryId);
  getSimilarMovies(categoryId);
  getRecommendedMovies(categoryId);
};

// DETAILED DATA OF THE TV SHOW SELECTED
/**
 * It gets the tv show data from the API and displays it on the page
 */
const getTvById = async () => {
  const [_, categoryData] = location.hash.split("="); // ["#category", "id-name-type"]
  const [categoryId] = categoryData.split("-");

  const { data: tv } = await api(`/tv/${categoryId}`);
  showDirector.innerHTML = "";
  showCompanies.innerHTML = "";

  if (tv.backdrop_path === null) {
    showPortrait.setAttribute(
      "src",
      "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png"
    );
  } else {
    showPortrait.setAttribute(
      "src",
      `https://image.tmdb.org/t/p/w780${tv.backdrop_path}`
    );
  }
  showTitle.textContent = tv.name;
  showDate.textContent = tv.first_air_date;
  tv.genres.length == 0
    ? (showGenre.textContent = "-")
    : (showGenre.textContent = tv.genres[0].name);
  tv.overview == ""
    ? (showResume.textContent = "-")
    : (showResume.textContent = tv.overview);
  showScore.textContent = `${tv.vote_average}✨`;

  if (tv.networks.length == 0) {
    showNetworkLogo.textContent = "-";
  } else {
    showNetworkLogo.setAttribute(
      "src",
      `https://image.tmdb.org/t/p/w92${tv.networks[0].logo_path}`
    );
  }
  tv.episode_run_time.length == 0
    ? (showLength.textContent = "- ")
    : (showLength.textContent = `${tv.episode_run_time[0]}m`);

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
  getAndAppend(`/movie/${id}/similar`, "item-related", similarList);
};

const getRecommendedMovies = async (id) => {
  getAndAppend(`/movie/${id}/recommendations`, "item-related", recomendList);
};

const getSimilarTv = async (id) => {
  getAndAppend(`/tv/${id}/similar`, "item-related", similarList);
};

const getRecommendedTv = async (id) => {
  getAndAppend(`/tv/${id}/recommendations`, "item-related", recomendList);
};

const getCastMovie = async (id) => {
  appendPeople(`/movie/${id}/credits`, castList, "cast");
};

const getCastTv = async (id) => {
  appendPeople(`/tv/${id}/credits`, castList, "cast");
};

// FAVORITES CODE

/**
 * It takes in a section, container, and imgSection as arguments and then creates a generic container,
 * image, and like button for each item in the likedItemList array
 * @param section - the section where the items will be displayed
 * @param container - the class name of the container that will hold the image and the like button
 * @param imgSection - the class name of the image element
 */
const getFavoriteItems = (section, container, imgSection) => {
  const likedItems = likedItemList();
  const itemsArr = Object.values(likedItems);
  let showAlt;
  section.innerHTML = "";

  if (itemsArr.length == 0) {
    const emptyContainer = document.createElement("div");
    emptyContainer.classList.add(`favorites-empty-container`);
    emptyContainer.textContent = "You have no favorites";
    section.appendChild(emptyContainer);
  } else {
    itemsArr.forEach((show) => {
      const genericContainer = document.createElement("div");
      genericContainer.classList.add(container);

      const genericImg = document.createElement("img");
      genericImg.classList.add(imgSection);
      genericImg.addEventListener("click", () => {
        show.name === undefined
          ? (location.hash = `#movie=${show.id}-movie`)
          : (location.hash = `#movie=${show.id}-tv`);
      });

      if (show.name === undefined) {
        genericImg.setAttribute("alt", show.title);
        showAlt = show.title;
      } else if (show.title === undefined) {
        genericImg.setAttribute("alt", show.name);
        showAlt = show.name;
      }

      if (show.poster_path === null) {
        genericImg.setAttribute(
          "data-img",
          "https://icon-library.com/images/light-icon-png/light-icon-png-21.jpg"
        );
        const foundAlt = document.createElement("span");
        foundAlt.classList.add("altShowDescription");
        foundAlt.textContent = showAlt;

        foundAlt.addEventListener("click", () => {
          show.name === undefined
            ? (location.hash = `#movie=${show.id}-movie`)
            : (location.hash = `#movie=${show.id}-tv`);
        });

        genericContainer.appendChild(foundAlt);
      } else {
        genericImg.setAttribute(
          "data-img",
          `https://image.tmdb.org/t/p/w185${show.poster_path}`
        );
      }
      // lazy loading
      lazyLoader.observe(genericImg);

      const likeBtn = document.createElement("button");
      likeBtn.classList.add("like-btn");
      likeBtn.innerHTML = `<i class="fa-solid fa-heart"></i>`;

      likedItemList()[show.id] && likeBtn.classList.add("delete-favorite");

      likeBtn.addEventListener("click", () => {
        likeBtn.classList.toggle("delete-favorite");
        likeItem(show);
        section == favList ? getFavoriteItemsMain() : getFavoriteItemsSection();
      });

      genericContainer.append(genericImg, likeBtn);
      section.appendChild(genericContainer);
    });
  }
};

const getFavoriteItemsMain = () => {
  getFavoriteItems(favList, "favorites-container", "favorite-img");
};

const getFavoriteItemsSection = () => {
  getFavoriteItems(
    favListSection,
    "favorites-container__section",
    "favorite-img__section"
  );
};
