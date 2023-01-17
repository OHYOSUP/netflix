import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getNowPlayingMovies,
  IGetMoivesResult,
  getNowPopularMovies,
  getMovieDetail,
  IMoveDetailProps,
} from "../api";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueries } from "react-query";
import {
  useNavigate,
  useMatch,
  useParams,
  useLocation,
} from "react-router-dom";
import makeImagePath from "../Routes/makeImagePath";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FcRating } from "react-icons/fc";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { IconContext } from "react-icons";
import { moveEmitHelpers } from "typescript";

const Slider = styled(motion.div)`
  position: relative;
  margin-bottom: 180px;
  padding: 40px;
  top: -20px;
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

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.darker};
  opacity: 0;
  position: absolute;
  width: 100%;
  height: 80px;
  bottom: -70px;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  p {
    font-size: 18px;
    color: ${(props) => props.theme.white.lighter};
    font-weight: 500;
    display: flex;
    align-items: center;
    text-shadow: 0.3px 0.3px 0.3px black;
  }
  span {
    color: ${(props) => props.theme.white.lighter};
    font-size: 12px;
    padding-top: 15px;
    text-shadow: 0.3px 0.3px 0.3px black;
  }
`;
const LeftArrow = styled(motion.div)`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  left: 40px;
  bottom: -50;
  z-index: 99;
  width: 4vw;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
`;
const RightArrow = styled(motion.div)`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  right: 0px;
  bottom: -50;
  z-index: 99;
  width: 4vw;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    borderRadius: "5px",
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
    borderRadius: "0 0 5px 5px",
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
  left: 0;
  opacity: 0;
`;
const BigMovie = styled(motion.div)`
  position: fixed;
  width: 40vw;
  heigth: 40vh;
  top: 100px;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  background-color: ${(props) => props.theme.black.darker};
`;

const BigCover = styled.img`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
  border: 0;
  overflow: hidden;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 40px;
  font-size: 46px;
  font-weight: 800;
  position: relative;
  top: -140px;
  width: 25vw;
  text-shadow: 1px 1px 1px black;
  color: ${(props) => props.theme.white.darker};
`;

const BigOverview = styled.div`
  position: relative;
  text-shadow: 1px 1px 1px black;
  padding: 40px;
  width: 40vw;
  height: 220px;
  line-height: 26px;
  color: ${(props) => props.theme.white.darker};
  top: -150px;
  display: flex;
  flex-direction: column;
  text-shadow: 0.3px 0.3px 0.3px white;

  p {
    width: 5vw;
    display: flex;
    justify-content: space-between;
    padding-top: 20px;
    text-shadow: 0.3px 0.3px 0.3px white;
  }

  div {
    width: 20vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 20px;
    color: ${(props) => props.theme.white.darker};
    text-shadow: 0.3px 0.3px 0.3px white;
  }
`;

const arrowVariants = {
  start: { opacity: 0 },
  hover: {
    opacity: 1,
    tansition: { duration: 0.5 },
  },
};

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

const rowLeftVaiants = {
  hidden: {
    x: -window.outerWidth,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: window.outerWidth - 5,
  },
};

function Category() {
  const [leaving, setLeaving] = useState(false);
  const [turn, setTurn] = useState(true);
  const [index, setIndex] = useState(0);
  const bigMovieMatch = useMatch("/movies/:movieId");
  const filmId = Number(bigMovieMatch?.params.movieId);
  const offset = 6;
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<IGetMoivesResult>(
    ["movies", "nowPlaying"],
    getNowPlayingMovies
  );
  const [movieDetail, setMovieDetail] = useState<IMoveDetailProps>();

  const {data: getMovieDetail ,refetch} = useQuery(["detail", filmId], async () => {
    return await axios
      .get(
        `https://api.themoviedb.org/3/movie/${filmId}?api_key=83c3e98ddabce65b906b3e5b39f39683`
      ).then(res=>setMovieDetail(res.data))
      
  }, {enabled: false});

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
      setTurn(false);
    }
  };

  const decreaseIndex = () => {
    if (leaving) return;
    if (data) {
      toggleLeaving();
      const totalMovie = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      setTurn(true);
    }
  };

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  const onBoxClick = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const goBackHomt = () => {
    navigate(`/`);
  };

  const clickedMovie = data?.results.find(
    (movie) => movie.id + "" === bigMovieMatch?.params.movieId
  );

  interface IGenres {
    id: number;
    name: string;
  }
  interface IDetailProps {
    id: number;
    name: string;
    runtime: number;
    genres: IGenres[];
    vote_average: number;
  }

  const [detail, setDetail] = useState<IDetailProps>();
  const location = useLocation();



  return (
    <Slider whileHover="hover">
      <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
        {/* <LeftArrow
          variants={arrowVariants}
          initial="start"
          whileHover="hover"
          onClick={increaseIndex}
        >
          <IconContext.Provider value={{ size: "4em" }}>
            <IoIosArrowBack />
          </IconContext.Provider>
        </LeftArrow> */}

        <RightArrow
          initial="start"
          variants={arrowVariants}
          whileHover="hover"
          onClick={decreaseIndex}
        >
          <IconContext.Provider
            value={{
              size: "4em",
            }}
          >
            <IoIosArrowForward />
          </IconContext.Provider>
        </RightArrow>

        <Row
          variants={turn ? rowVaiants : rowLeftVaiants}
          initial="hidden"
          animate="visible"
          exit="exit"
          key={index}
          transition={{ type: "tween", duration: 1 }}
        >
          {data?.results
            .slice(1)
            .slice(offset * index, offset * index + offset)
            .map((movie) => (
              <div key={movie.id}>
                <Box
                  layoutId={movie.id + ""}
                  onClick={async () => {
                    await onBoxClick(movie.id);
                    refetch()
                  }}
                  variants={boxVariants}
                  initial="normal"
                  whileHover="hover"
                  transition={{ type: "tween" }}
                  bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                >
                  <Info variants={infoVariants}>
                    <InfoBox>
                      <p>{movie.title}</p>
                      <span>{movie.release_date.slice(0, 4)}</span>
                    </InfoBox>
                  </Info>
                </Box>
              </div>
            ))}
        </Row>
      </AnimatePresence>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              onClick={goBackHomt}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <BigMovie layoutId={bigMovieMatch.params.movieId + ""}>
              {clickedMovie && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                        clickedMovie.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  ></BigCover>
                  <BigTitle>{clickedMovie.title}</BigTitle>
                  <BigOverview>
                    {clickedMovie.overview}

                    <p>
                      <span>⭐{movieDetail?.vote_average.toFixed(1)}</span>
                      <span>{movieDetail?.runtime}분</span>
                    </p>
                    <div>
                      {/* {detail?.genres.map((item) => (
                        <span key={item.id}>{item.name}</span>
                      ))} */}
                      {movieDetail?.genres.map(item=>(
                        <span key={item.id}>{item.name}</span>
                        
                      ))}
                    </div>
                  </BigOverview>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </Slider>
  );
}

export default Category;
