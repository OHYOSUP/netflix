import { useQuery } from "react-query";
import { useState } from "react";
import {
  getNowPlayingMovies,
  IGetMoivesResult,
  Types,
  IMoveDetailProps,
  BASE_PATH,
  API_KEY,
} from "../api";
import styled from "styled-components";
import makeImagePath from "./makeImagePath";
import { useNavigate, useMatch } from "react-router-dom";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import axios from "axios";
import Category from "../Components/Category";
import {
  NowLoading,
  Overlay,
  BigMovie,
  BigCover,
  BigOverview,
} from "../style/styled";
const Wrapper = styled.div`
  background: black;
`;
const Banner = styled.div<{ bgPhoto: string }>`
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 72px;
  margin-bottom: 20px;
  text-shadow: 1px 1px 1px black;
`;
const Overview = styled.p`
  font-size: 16px;
  line-height: 32px;
  width: 30%;
  font-weight: 600;
  text-shadow: 1px 1px 1px black;
`;
const DetailedInfo = styled(motion.div)`
  width: 6vw;
  height: 5vh;
  border-radius: 5px;
  background-color: ${(props) => props.theme.black.lighter};
  color: ${(props) => props.theme.white.lighter};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
`;
const Categories = styled.h2`
  font-size: 28px;
  font-weight: 450;
  padding-left: 40px;
`;

function Home() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<IGetMoivesResult>(
    ["movies", "nowPlaying"],
    () => getNowPlayingMovies(Types.now_playing)
  );

  const [movieDetail, setMovieDetail] = useState<IMoveDetailProps>();

  const filmId = data?.results[0].id;
  const bigMovieMatch = useMatch(`/movies/banner/${filmId}`);

  const { data: getMovieDetail, refetch } = useQuery(
    ["detail", filmId],
    async () => {
      return await axios
        .get(`${BASE_PATH}movie/${filmId}?api_key=${API_KEY}`)
        .then((res) => setMovieDetail(res.data));
    },
    { enabled: false }
  );

  const { scrollY } = useScroll();

  const movieID = data?.results[0].id;

  const onDetailClick = (movieID: number) => {
    navigate(`/movies/banner/${movieID}`);
  };

  const goBackHomt = () => {
    navigate(`/`);
  };

  return (
    <Wrapper>
      {isLoading ? (
        <NowLoading>Loading...</NowLoading>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].original_title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
            <DetailedInfo
              onClick={() => {
                onDetailClick(movieID as number);
                refetch();
              }}
            >
              Detail
            </DetailedInfo>
          </Banner>
          <Categories>Now playing</Categories>
          <Category type={Types.now_playing}></Category>
          <Categories>Popular</Categories>
          <Category type={Types.popular}></Category>
          <Categories>TOP RATED</Categories>
          <Category type={Types.top_rated}></Category>
        </>
      )}
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            {data?.results[0] ? (
              <>
                <Overlay
                  onClick={goBackHomt}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  layoutId={"banner" + data?.results[0].id + ""}
                  scrollY={scrollY.get()}
                >
                  {data?.results[0] && (
                    <>
                      <BigCover
                        bgPhoto={makeImagePath(
                          data?.results[0].backdrop_path,
                          "w500"
                        )}
                      >
                        <h2>{data?.results[0].title}</h2>
                      </BigCover>
                      <BigOverview>
                        <h2>{data?.results[0].overview}</h2>
                        <p>
                          <span>⭐{data.results[0].vote_average}</span>
                          <span>{movieDetail?.runtime}min</span>
                        </p>
                        <p>
                          {movieDetail?.genres.map((item) => (
                            <span key={item.id}>{item.name}</span>
                          ))}
                        </p>
                      </BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </>
        ) : null}
      </AnimatePresence>
    </Wrapper>
  );
}

export default Home;
