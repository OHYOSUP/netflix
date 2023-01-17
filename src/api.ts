const API_KEY = "83c3e98ddabce65b906b3e5b39f39683";
const BASE_PATH = "https://api.themoviedb.org/3/";
const movieId = null;
interface IMoive {
  id: number;
  original_title: string;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  vote_average: string;
  release_date: string;
  genre_ids: number[];
}

export interface IGetMoivesResult {
  dates: {
    maximun: string;
    minumum: string;
  };
  page: number;
  results: IMoive[];
  total_pages: number;
  total_results: number;
}

export function getNowPlayingMovies() {
  return fetch(
    `${BASE_PATH}movie/now_playing?api_key=${API_KEY}&language=ko-KR`
  ).then((res) => res.json());
}

interface IMovieGenres {
  id: number;
  name: string;
}
export interface IMoveDetailProps {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  };
  budget: number;
  genres: IMovieGenres[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: [
    {
      id: number;
      logo_path: string;
      name: string;
      origin_country: string;
    }
  ];
  production_countries: [
    {
      iso_3166_1: string;
      name: string;
    }
  ];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: [
    {
      english_name: string;
      iso_639_1: string;
      name: string;
    }
  ];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export function getMovieDetail() {
  return fetch(
    `${BASE_PATH}movie/${""}}?api_key=${API_KEY}&language=ko-KR`
  ).then((res) => res.json());
}

export function getNowPopularMovies() {
  return fetch(
    `${BASE_PATH}movie/popular?api_key=${API_KEY}&language=ko-KR`
  ).then((res) => res.json());
}

export function getLatestMovies() {
  return fetch(`${BASE_PATH}movie/latest?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}
