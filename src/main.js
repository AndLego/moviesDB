const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: API_KEY,
  },
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

      const itemImg = document.createElement("img");
      itemImg.classList.add("item-img");

      byname == "name"
        ? itemImg.setAttribute("alt", show.name)
        : itemImg.setAttribute("alt", show.title);

      itemImg.setAttribute(
        "src",
        `https://image.tmdb.org/t/p/w300${show.poster_path}`
      );

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

const getTrendingPeople = async () => {
  try {
    const { data } = await api("/trending/person/day");
    const person = data.results;
    trendingPeopleList.innerHTML = "";
    person.forEach((person) => {
      const peopleContainer = document.createElement("div");
      peopleContainer.classList.add("people-container");

      const personImg = document.createElement("img");
      personImg.classList.add("people-img");
      personImg.setAttribute("alt", person.name);
      personImg.setAttribute(
        "src",
        `https://image.tmdb.org/t/p/w185${person.profile_path}`
      );

      const personSpan = document.createElement("span");
      personSpan.classList.add("people-name");
      personSpan.textContent = person.name;

      peopleContainer.appendChild(personSpan);
      peopleContainer.appendChild(personImg);
      trendingPeopleList.appendChild(peopleContainer);
    });
  } catch (err) {
    console.error(err);
  }
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
        "src",
        `https://image.tmdb.org/t/p/w92${data.logo_path}`
      );

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
  optionalConfig = {}
) => {
  try {
    const { data } = await api(path, optionalConfig);
    const generic = data.results;
    section.innerHTML = "";
    console.log(data)
    generic.forEach((show) => {
      const genericContainer = document.createElement("div");
      genericContainer.classList.add(`${parentContainer}-container`);

      const genericImg = document.createElement("img");
      genericImg.classList.add(`${parentContainer}-img`);

      byname == "name"
        ? genericImg.setAttribute("alt", show.name)
        : genericImg.setAttribute("alt", show.title);

      genericImg.setAttribute(
        "src",
        `https://image.tmdb.org/t/p/w300${show.poster_path}`
      );

      genericContainer.appendChild(genericImg);
      section.appendChild(genericContainer);
    });
  } catch (err) {
    console.error(err);
  }
};

const getPopularMovies = () => {
  getAndAppend("/movie/popular", "generic", popularMovieList, "title")

};

const getPopularTv = () => {
  getAndAppend("/tv/popular", "generic", popularTvList, "name")
};

const getUpcomingMovies = () => {
  getAndAppend("/movie/upcoming", "generic", upcomingMoviesList, "title")
};

const getTopShows = () => {
  getAndAppend("/tv/top_rated", "generic", topShowList, "name")
};

const getTopMovies = () => {
  getAndAppend("/movie/top_rated", "generic", topMovieList, "title")
};

const getPopularAll = () => {
  getAndAppend("/trending/all/day", "catalogue", popularAllList, "name")
};

const getProductByCategoryMovie = (id) => {
  getAndAppend("/discover/movie", "catalogue", genreList, "name", {
    params: { with_genres: id },
  });
};

const getProductByCategoryTv = (id) => {
  getAndAppend("/discover/tv", "catalogue", genreList, "name", {
    params: { with_genres: id },
  });
};

