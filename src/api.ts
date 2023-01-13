const API_KEY = "83c3e98ddabce65b906b3e5b39f39683";
const BASE_PATH = "https://api.themoviedb.org/3/";

interface IMoive {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string,
  overview: string

}


export interface IGetMoivesResult {
  dates:{
    maximun: string,
    minumum: string
  },
  page: number,
  results: IMoive[],
  total_pages: number,
  total_results: number
}

export function getMovies() {
  return fetch(`${BASE_PATH}movie/now_playing?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}
