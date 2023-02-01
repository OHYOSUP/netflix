import {  useState } from "react";
import {
  getNowPlayingMovies,
  IGetMoivesResult,
  IMoveDetailProps,
  Types,
  BASE_PATH,
  API_KEY,
  ISimilar,
} from "../api";
import axios from "axios";
import { AnimatePresence, useScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useNavigate, useMatch } from "react-router-dom";
import makeImagePath from "../Routes/makeImagePath";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { IconContext } from "react-icons";
import {  useWindowDimensions } from "./Utils";
import {
  Slider,
  Row,
  Box,
  Info,
  InfoBox,
  LeftArrow,
  RightArrow,
  Overlay,
  BigMovie,
  BigCover,
  BigOverview,
  SimilarBox,
  Similar,
  SimilarInfo,
} from "../style/styled";
import {
  boxVariants,
  infoVariants,
  SimilarBoxVariants,
  similarInfoVariants,
  arrowVariants,
  rowVariants,
} from "../style/variants";

function Category({ type }: { type: Types }) {
  const [leaving, setLeaving] = useState(false);
  const [turn, setTurn] = useState(true);
  const [index, setIndex] = useState(0);
  const bigMovieMatch = useMatch(`/movies/${type}/:movieId`);
  const filmId = Number(bigMovieMatch?.params.movieId);
  const offset = 6;
  const navigate = useNavigate();
  const width = useWindowDimensions();
  const { scrollY } = useScroll();

  const {
    data,
    isLoading,
    refetch: getMovieRefetch,
  } = useQuery<IGetMoivesResult>(["movies", type], () =>
    getNowPlayingMovies(type)
  );

  const [movieDetail, setMovieDetail] = useState<IMoveDetailProps>();

  const { data: getMovieDetail, refetch } = useQuery(
    ["detail", filmId],
    async () => {
      return await axios
        .get(`${BASE_PATH}movie/${filmId}?api_key=${API_KEY}`)
        .then((res) => setMovieDetail(res.data));
    },
    { enabled: false }
  );

  const increaseIndex = () => {
    //? increaseIndex함수를 연속으로 실행시켰을 때 두 Row컴포넌트
    //? 사이가 벌어지는 현상을 방지
    // 처음 클릭했을 때 leaving이 false니까 setLeaving만 true로
    // 바꿔주고 index만 증가시키는데 그 다음부터는 leaving이
    // true니까 아무것도 return하지 않는다.
    if (data) {
      if (leaving) return;
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
    if (data) {
      if (leaving) return;
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

  const onBoxClick = ({
    movieId,
    category,
  }: {
    movieId: number;
    category: string;
  }) => {
    navigate(`/movies/${category}/${movieId}`);
  };

  const goBackHomt = () => {
    navigate(`/Netflix-clone`);
  };

  const clickedMovie = data?.results.find(
    (movie) => movie.id + "" === bigMovieMatch?.params.movieId
  );

  const [getSimilar, setGetSilmilar] = useState<ISimilar>();
  const { data: getSimilarMoive, refetch: similarRefetch } = useQuery(
    ["similar", filmId],
    async () => {
      return await axios
        .get(`${BASE_PATH}movie/${filmId}/similar?api_key=${API_KEY}`)
        .then((res) => setGetSilmilar(res.data));
    },
    { enabled: false }
  );

  const similarBoxOnClicked = ({
    contentId,
    category,
    keyword
  }: {
    contentId: number;
    category: string;
    keyword: string;
  }) => {
    navigate(`/search?keyword=${keyword}`);

  };


  return (
    <>
      <Slider>
        <AnimatePresence
          initial={false}
          onExitComplete={toggleLeaving}
          custom={{ width, turn }}
        >
          <Row
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key={type + index}
            custom={{ width, turn }}
            transition={{ type: "tween", duration: 1 }}
          >
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  key={type + movie.id}
                  layoutId={type + String(movie.id)}
                  onClick={async () => {
                    await onBoxClick({ movieId: movie.id, category: type });
                    refetch();
                    similarRefetch();
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
                      {/* slice함수를 넣으면 에러가 남. 왜지.. */}
                      {/* <span>{movie.release_date.slice(0,4)}</span> */}
                    </InfoBox>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
        <LeftArrow
          variants={arrowVariants}
          initial="start"
          whileHover="hover"
          onClick={increaseIndex}
        >
          <IconContext.Provider value={{ size: "4em" }}>
            <IoIosArrowBack />
          </IconContext.Provider>
        </LeftArrow>

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
      </Slider>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              onClick={goBackHomt}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <BigMovie
              layoutId={type + String(bigMovieMatch.params.movieId)}
              scrollY={scrollY.get()}
            >
              {clickedMovie && (
                <>
                  <BigCover
                    bgPhoto={makeImagePath(clickedMovie.backdrop_path, "w500")}
                  >
                    <h2>{clickedMovie.title}</h2>
                  </BigCover>
                  <BigOverview>
                    <h2>{clickedMovie.overview}</h2>
                    <p>
                      <span>⭐{movieDetail?.vote_average.toFixed(1)}</span>
                      <span>{movieDetail?.runtime}min</span>
                    </p>
                    <p>
                      {movieDetail?.genres.map((item) => (
                        <span key={item.id}>{item.name}</span>
                      ))}
                    </p>
                    <SimilarBox>
                      {getSimilar?.results.slice(0, 18).map((item) => (
                        <Similar
                          variants={SimilarBoxVariants}
                          initial="normal"
                          whileHover="hover"
                          transition={{ type: "tween" }}
                          bgphoto={makeImagePath(item.backdrop_path, "w500")}
                          key={"similar" + String(item.id)}
                          onClick={() => {
                            similarBoxOnClicked({
                              contentId: item.id,
                              category: type,
                              keyword: item.original_title
                            });
                          }}
                        >
                          <SimilarInfo variants={similarInfoVariants}>
                            {item.title}
                          </SimilarInfo>
                        </Similar>
                      ))}
                    </SimilarBox>
                  </BigOverview>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default Category;
