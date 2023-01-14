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
} from "../api";
import styled from "styled-components";
import makeImagePath from "./makeImagePath";
import { useNavigate, useMatch } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Category from "../Components/Category";

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
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const Overlay = styled(motion.div)`
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: fixed;
  width: 40vw;
  height: 80vh;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background-color: black;
  border-radius: 15px;
`;

const BigCover = styled.img`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
  border-radius: 15px;
  overflow: hidden;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 40px;
  font-size: 46px;
  font-weight: 800;
  position: relative;
  top: -200px;
  width: 25vw;
  text-shadow: 1px 1px 1px black;
`;

const BigOverview = styled.p`
  position: relative;
  text-shadow: 1px 1px 1px black;
  padding: 40px;
  width: 25vw;
  line-height: 24px;
  color: ${(props) => props.theme.white.lighter};
  top: -150px;
`;

function Home() {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");

  const { data, isLoading } = useQuery<IGetMoivesResult>(
    ["movies", "nowPlaying"],
    getNowPlayingMovies
  );

  const popularData = useQuery<IGetMoivesResult>("popularMovies", getNowPopularMovies);

  

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const increaseIndex = () => {
    //? increaseIndex함수를 연속으로 실행시켰을 때 두 Row컴포넌트
    //? 사이가 벌어지는 현상을 방지
    // 처음 클릭했을 때 leaving이 false니까 setLeaving만 true로
    // 바꿔주고 index만 증가시키는데 그 다음부터는 leaving이
    // true니까 아무것도 return하지 않는다.
    if (leaving) return;
    if (data) {
      toggleLeaving();
      // 불러온 데이터의 length
      const totalMovie = data?.results.length - 1;
      // 한 페이지에 offset만큼 영화를 불러왔을 떄 페이지 수
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      // 만약 index가 maxIndex만큼 증가했을 때 다시 초기페이지로
      // 돌아갈 로직
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  const offset = 6;

  const onBoxClick = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const movieID = data?.results[0].id;
  const onDetailClick = (movieID: number) => {
    navigate(`/movies/${movieID}`);
  };

  const goBackHomt = () => {
    navigate(`/`);
  };

  // 클릭한 영화의 데이터 찾기
  const clickedMovie = data?.results.find(
    (movie) => movie.id + "" === bigMovieMatch?.params.movieId
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].original_title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
            <DetailedInfo onClick={() => onDetailClick(movieID as any)}>
              상세정보
            </DetailedInfo>
          </Banner>
          <Categories>Now playing</Categories>
          <Category></Category>
  
        </>
      )}
    </Wrapper>
  );
}

export default Home;
