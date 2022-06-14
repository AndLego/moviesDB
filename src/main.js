const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: API_KEY,
  },
});

const getTrendingTv = async () => {
  try {
    const { data } = await api("/trending/tv/day");
    const tv = data.results;
    tv.forEach((show, index) => {
      const trendingTv = document.querySelector("#trendingTv .trendingTv-List");
      const movieContainer = document.createElement("div");
      movieContainer.classList.add("tv-container");

      const tvImg = document.createElement("img");
      tvImg.classList.add("tv-img");
      tvImg.setAttribute("alt", tv.name);
      tvImg.setAttribute(
        "src",
        `https://image.tmdb.org/t/p/w300${show.poster_path}`
      );

      const tvSpan = document.createElement("span");
      tvSpan.classList.add("tv-number");
      tvSpan.textContent = index + 1;

      movieContainer.appendChild(tvSpan);
      movieContainer.appendChild(tvImg);
      trendingTv.appendChild(movieContainer);
    });
  } catch (err) {
    console.error(err);
  }
};

const getTrendingMovies = async () => {
  try {
    const { data } = await api("/trending/movie/day");

    const movie = data.results;
    movie.forEach((show, index) => {
      const trendingMovie = document.querySelector(
        "#trendingMovies .trendingMovies-List"
      );
      const movieContainer = document.createElement("div");
      movieContainer.classList.add("movie-container");

      const movieImg = document.createElement("img");
      movieImg.classList.add("movie-img");
      movieImg.setAttribute("alt", movie.name);
      movieImg.setAttribute(
        "src",
        `https://image.tmdb.org/t/p/w300${show.poster_path}`
      );

      const movieSpan = document.createElement("span");
      movieSpan.classList.add("movie-number");
      movieSpan.textContent = index + 1;

      movieContainer.appendChild(movieSpan);
      movieContainer.appendChild(movieImg);
      trendingMovie.appendChild(movieContainer);
    });
  } catch (err) {
    console.error(err);
  }
};

const getTrendingPeople = async () => {
  try {
    const { data } = await api("/trending/person/day");
    const person = data.results;
    person.forEach((person) => {
      const trendingPerson = document.querySelector(
        "#trendingPeople .people-List"
      );
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
      trendingPerson.appendChild(peopleContainer);
    });
  } catch (err) {
    console.error(err);
  }
};

const getGenresMovies = async () => {
  try {
    const { data } = await api("/genre/movie/list");

    const genre = data.genres;
    genre.forEach((genre) => {
      const genreMovie = document.querySelector("#genres .genres-list__movies");
      const genreContainer = document.createElement("div");
      genreContainer.classList.add("category-container");

      const genreName = document.createElement("h3");
      genreName.classList.add("category-title");
      genreName.setAttribute("id", `id${genre.id}`);
      genreName.textContent = genre.name;

      genreContainer.appendChild(genreName);
      genreMovie.appendChild(genreContainer);
    });
  } catch (err) {
    console.error(err);
  }
};

const getGenresTv = async () => {
  try {
    const { data } = await api("/genre/tv/list");

    const genre = data.genres;
    genre.forEach((genre) => {
      const genreTv = document.querySelector("#genres .genres-list__tv");
      const genreContainer = document.createElement("div");
      genreContainer.classList.add("category-container");

      const genreName = document.createElement("h3");
      genreName.classList.add("category-title");
      genreName.setAttribute("id", `id${genre.id}`);
      genreName.textContent = genre.name;

      genreContainer.appendChild(genreName);
      genreTv.appendChild(genreContainer);
    });
  } catch (err) {
    console.error(err);
  }
};

const bringTv = () => {
  const genreContainerMovie = document.querySelector(".genres-list__movies");
  const genreContainerTv = document.querySelector(".genres-list__tv");

  genreContainerMovie.classList.add("inactive");
  genreContainerTv.classList.remove("inactive");

  getGenresTv();
};

const bringMovie = () => {
  const genreContainerMovie = document.querySelector(".genres-list__movies");
  const genreContainerTv = document.querySelector(".genres-list__tv");

  genreContainerTv.classList.add("inactive");
  genreContainerMovie.classList.remove("inactive");

  getGenresMovies();
};

const getNetworksImg = async () => {
  const networksId = [213, 1024, 49, 2739, 2552, 453, 303, 67];

  networksId.forEach(async (item) => {
    const { data } = await api(`/network/${item}`);

    const network = document.querySelector("#networks .networks-List");
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
    network.appendChild(networkContainer);
  });
};

getTrendingTv();
getTrendingMovies();
getTrendingPeople();
getGenresMovies();
getNetworksImg();
