import { useState } from "react";
import { useQuery } from "react-query";
import {
  getTvOnTheAir,
  TvTypes,
  ITvOnTheAirProps,
  BASE_PATH,
  API_KEY,
  ITvDetailProps,
  ITvSimilarProps,
} from "../api";
import { AnimatePresence, useScroll } from "framer-motion";
import makeImagePath from "../Routes/makeImagePath";
import { useWindowDimensions } from "./Utils";
import { useMatch, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { IconContext } from "react-icons";
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
  BoxWrapper,
} from "../style/styled";
import {
  boxVariants,
  infoVariants,
  SimilarBoxVariants,
  similarInfoVariants,
  arrowVariants,
  rowVariants,
} from "../style/variants";
import { useRecoilState } from "recoil";
import { turnContent } from "../atom";

// import { contentToggle } from "../Routes/Search";
function TvCategory({ type }: { type: TvTypes }) {
  const [leaving, setLeaving] = useState(false);
  const [turn, setTurn] = useState(false);
  const [index, setIndex] = useState(0);
  const offset = 6;
  const navigate = useNavigate();
  const width = useWindowDimensions();
  const { scrollY } = useScroll();

  const [toggleContent, setToggleContent] = useRecoilState(turnContent);

  const { data, isLoading } = useQuery<ITvOnTheAirProps>(["onAir", type], () =>
    getTvOnTheAir(type)
  );

  const bigProgramMatch = useMatch(`/tv/${type}/:programId`);

  const clickedProgram = data?.results.find(
    (program) => program.id + "" === bigProgramMatch?.params.programId
  );
  const programId = Number(bigProgramMatch?.params.programId);

  const [getDetailData, setDetailData] = useState<ITvDetailProps>();

  const { data: detailData, refetch: detailRefetch } = useQuery(
    ["tvDetail", programId],
    () => {
      axios
        .get(`${BASE_PATH}tv/${programId}?api_key=${API_KEY}&language=en-US`)
        .then((res) => setDetailData(res.data));
    },
    { enabled: false }
  );

  const [similarTvData, setSimilarTvData] = useState<ITvSimilarProps>();

  const { data: similarData, refetch: similarRefetch } = useQuery(
    ["tvSimilar", programId],
    () => {
      axios
        .get(`${BASE_PATH}tv/${programId}/similar?api_key=${API_KEY}`)
        .then((res) => setSimilarTvData(res.data));
    },
    { enabled: false }
  );

  const onBoxClick = ({
    tvId,
    category,
  }: {
    tvId: number;
    category: string;
  }) => {
    navigate(`/tv/${category}/${tvId}`);
  };

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

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
  const goBackHomt = () => {
    navigate(`/tv`);
  };

  const similarBoxOnClicked = ({
    contentId,
    category,
    keyword,
  }: {
    contentId: number;
    category: string;
    keyword: string;
  }) => {
    navigate(`/search?keyword=${keyword}`);
    setToggleContent(false);
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
              .map((tv) => (
                <BoxWrapper key={tv.id}>
                  {tv.backdrop_path ? (
                    <Box
                      key={type + tv.id}
                      layoutId={type + String(tv.id)}
                      onClick={async () => {
                        await onBoxClick({ tvId: tv.id, category: type });
                        detailRefetch();
                        similarRefetch();
                      }}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(tv.backdrop_path + "", "w500")}
                    >
                      <Info variants={infoVariants}>
                        <InfoBox>
                          <p>{tv.original_name}</p>
                          <span>{tv.first_air_date.slice(0, 4)}</span>
                        </InfoBox>
                      </Info>
                    </Box>
                  ) : (
                    <Box
                      key={type + tv.id}
                      layoutId={type + String(tv.id)}
                      onClick={async () => {
                        await onBoxClick({ tvId: tv.id, category: type });
                        detailRefetch();
                        similarRefetch();
                      }}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(tv.backdrop_path + "", "w500")}
                    >
                      Image is Preparing
                      <Info variants={infoVariants}>
                        <InfoBox>
                          <p>{tv.original_name}</p>
                          <span>{tv.first_air_date.slice(0, 4)}</span>
                        </InfoBox>
                      </Info>
                    </Box>
                  )}
                </BoxWrapper>
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
        {bigProgramMatch ? (
          <>
            <Overlay
              onClick={goBackHomt}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <BigMovie
              layoutId={type + String(bigProgramMatch.params.programId)}
              scrollY={scrollY.get()}
            >
              {clickedProgram && (
                <>
                  <BigCover
                    bgPhoto={makeImagePath(
                      clickedProgram.backdrop_path + "",
                      "w500"
                    )}
                  >
                    <h2>{clickedProgram.original_name}</h2>
                  </BigCover>
                  <BigOverview>
                    <h2>{clickedProgram.overview}</h2>
                    <p>
                      <span>⭐{getDetailData?.vote_average.toFixed(1)}</span>
                      <span>{getDetailData?.runtime}min</span>
                    </p>
                    <p>
                      {getDetailData?.genres.map((item) => (
                        <span key={item.id}>{item.name}</span>
                      ))}
                    </p>
                    {clickedProgram.backdrop_path ? (
                      <SimilarBox>
                        {similarTvData?.results.slice(0, 18).map((item) => (
                          <Similar
                            onClick={() => {
                              similarBoxOnClicked({
                                contentId: item.id,
                                category: type,
                                keyword: item.original_name,
                              });
                            }}
                            variants={SimilarBoxVariants}
                            initial="normal"
                            whileHover="hover"
                            transition={{ type: "tween" }}
                            bgphoto={makeImagePath(
                              item.backdrop_path + "",
                              "w500"
                            )}
                            key={"similar" + String(item.id)}
                          >
                            <SimilarInfo variants={similarInfoVariants}>
                              {item.original_name}
                            </SimilarInfo>
                          </Similar>
                        ))}
                      </SimilarBox>
                    ) : (
                      <SimilarBox>
                        {similarTvData?.results.slice(0, 18).map((item) => (
                          <Similar
                            variants={SimilarBoxVariants}
                            initial="normal"
                            whileHover="hover"
                            transition={{ type: "tween" }}
                            bgphoto={makeImagePath(
                              item.backdrop_path + "",
                              "w500"
                            )}
                            key={"similar" + String(item.id)}
                          >
                            Image is Preparing
                            <SimilarInfo variants={similarInfoVariants}>
                              {item.original_name}
                            </SimilarInfo>
                          </Similar>
                        ))}
                      </SimilarBox>
                    )}
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

export default TvCategory;
