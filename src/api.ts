export const API_KEY = "83c3e98ddabce65b906b3e5b39f39683";
export const BASE_PATH = "https://api.themoviedb.org/3/";

export enum Types {
  "popular" = "popular",
  "latest" = "latest",
  "now_playing" = "now_playing",
  "top_rated" = "top_rated",
  "similar" = "similar",
}

export enum TvTypes {
  "on_the_air" = "on_the_air",
  "top_rated" = "top_rated",
  "popular" = "popular",
}

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

export function getNowPlayingMovies(type: Types) {
  return fetch(`${BASE_PATH}movie/${type}?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
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

export function getNowPopularMovies(type: Types) {
  return fetch(
    `${BASE_PATH}movie/${type}?api_key=${API_KEY}&language=ko-KR`
  ).then((res) => res.json());
}

export interface IMoivePopular {
  page: number;
  results: [
    {
      adult: boolean;
      backdrop_path: string;
      genre_ids: number[];
      id: number;
      original_language: string;
      original_title: string;
      overview: string;
      popularity: number;
      poster_path: string;
      release_date: string;
      title: string;
      video: boolean;
      vote_average: number;
      vote_count: number;
    }
  ];
}

export function getLatestMovies(type: Types) {
  return fetch(`${BASE_PATH}movie/${type}?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

export interface ISimilar {
  page: number;
  results: [
    {
      adult: boolean;
      backdrop_path: string;
      genre_ids: number[];
      id: number;
      original_language: string;
      original_title: string;
      overview: string;
      popularity: number;
      poster_path: string;
      release_date: string;
      title: string;
      video: boolean;
      vote_average: number;
      vote_count: number;
    }
  ];
}

export interface ITvOnTheAirProps {
  page: number;
  results: [
    {
      backdrop_path: null;
      first_air_date: string;
      genre_ids: number[];
      id: number;
      name: string;
      origin_country: string[];
      original_language: string;
      original_name: string;
      overview: string;
      popularity: number;
      poster_path: string;
      vote_average: number;
      vote_count: number;
    }
  ];
}

type ITvGenre = {
  id: number;
  name: string;
};

export interface ITvDetailProps {
  adult: boolean;
  backdrop_path: string;
  episode_run_time: number[];
  first_air_date: string;
  genres: ITvGenre[];
  id: number;
  languages: string[];
  vote_average: number;
  last_air_date: string;
  runtime: number;
}

export interface ITvSimilarProps {
  page: number;
  results: [
    {
      adult: boolean;
      backdrop_path: null;
      genre_ids: [];
      id: number;
      original_name: string;
      overview: string;
      popularity: number;
      poster_path: string;
      first_air_date: string;
      name: string;
      vote_average: number;
    }
  ];
}

export function getTvOnTheAir(type: TvTypes) {
  return fetch(`${BASE_PATH}tv/${type}?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

interface ISearchResult {
  backdrop_path: string;
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  vote_average: number;
}
export interface ISearchMovieProps {
  data:{
    results: ISearchResult[];
  } 
}
