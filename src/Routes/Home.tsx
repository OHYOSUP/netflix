//! section별로 slider만들기 -> themoviedb api 활용
//! tv show section만들기
//! seach 완성
//! bigMovies 스타일링
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  getNowPlayingMovies,
  IGetMoivesResult,
  getNowPopularMovies,
  getLatestMovies,
  Types
} from "../api";
import styled from "styled-components";
import makeImagePath from "./makeImagePath";
import { useNavigate, useMatch } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Category from "../Components/Category";
import LatestPlaying from "../Components/LatestPlaying";

const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
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
  width: 10vw;
  height: 7vh;
  border-radius: 5px;
  background-color: ${(props) => props.theme.black.lighter};
  color: ${(props) => props.theme.white.lighter};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
`;

const Slider = styled.div`
  position: relative;
  margin-bottom: 180px;
  padding: 40px;
  top: -100px;
`;

const Categories = styled.h2`
  font-size: 28px;
  font-weight: 450;
  padding-left: 40px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

// bgphto prop이 추가되었으니 typescript에게 타입 알려주기
const Box = styled(motion.div)<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  height: 200px;
  color: red;
  font-size: 66px;
  cursor: pointer;
  background-size: cover;
  background-position: center, center;

  // transform-origin : scale이 커지는 방향을 설정할 수 있다
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const rowVaiants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth,
  },
};

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

//? whileHover prop을 쓰지 않고 BoxVariants를 따로 지정한 이유 => whileHover에 delay를 걸면 마우스를 올렸을 때 2초, 마우스를 치웠을 때 2초씩 딜레이가 발생한다. 내가 하고싶은 건 마우스를 올렸을 때 스케일이 변화하는 delay만 2초가 발생하게 하고싶기 때문에 variants를 만들어 hover 내에서 transition - delay를 걸어서 마우스를 치웠을 때에는 바로 원래 스케일로 돌아가도록 한다.
//! variants를 활용하면 hover-transition만 제어할 수 있다.

function Home() {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch(`/movies/${Types.now_playing}/:movieId`);
  const { data, isLoading } = useQuery<IGetMoivesResult>(
    ["movies", "nowPlaying"],
    ()=> getNowPlayingMovies(Types.now_playing)
  );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  const offset = 6;

  const movieID = data?.results[0].id;
  const onDetailClick = (movieID: number) => {
    navigate(`/movies/${Types.now_playing}/${movieID}`);
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner            
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].original_title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
            <DetailedInfo onClick={() => onDetailClick(movieID as number)}>
              상세정보
            </DetailedInfo>
          </Banner>
          <Categories>Now playing</Categories>
          <Category type = {Types.now_playing}></Category>
           <Categories>지금 뜨는 콘텐츠</Categories>
          <Category type = {Types.popular}></Category>
          <Categories>TOP RATED</Categories>
          <Category type = {Types.top_rated}></Category>

        </>
      )}
    </Wrapper>
  );
}

export default Home;
