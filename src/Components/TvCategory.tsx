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
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import makeImagePath from "../Routes/makeImagePath";
import { getWindowDimensions, useWindowDimensions } from "./Utils";
import { useMatch, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { IconContext } from "react-icons";

const Slider = styled(motion.div)`
  position: relative;
  margin-bottom: 180px;
  padding: 40px;
  top: 10px;
  height: 180px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;
const BoxWrapper = styled.div`
  background: black;
`;
// bgphto prop이 추가되었으니 typescript에게 타입 알려주기
const Box = styled(motion.div)<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  height: 200px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-size: cover;
  background-position: center, center;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: rgba(0, 0, 0, 0);
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
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

const Overlay = styled(motion.div)`
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0;
`;
const BigMovie = styled(motion.div)<{ scrollY: number }>`
  position: absolute;
  width: 40vw;
  height: 80vh;
  top: ${(props) => props.scrollY + 75}px;
  left: 0;
  right: 0;
  z-index: 99;
  margin: 0 auto;
  border-radius: 10px 10px 0 0;

  overflow-x: hidden;
  ::-webkit-scrollbar {
    display: none;
  }
  background-color: ${(props) => props.theme.black.darker};
`;

const BigCover = styled.div<{ bgPhoto: string }>`
  width: 100%;
  border-radius: 5px 5px 0 0;
  height: 450px;
  border-top: 15px;
  position: relative;
  background-size: cover;
  background-position: center center;
  background-image: linear-gradient(transparent, black),
    url(${(props) => props.bgPhoto});
  display: flex;
  align-items: flex-end;
  h2 {
    font-size: 50px;
    padding: 20px 35px;
    font-weight: 600;
    text-shadow: 1px 1px 1px black;
  }
`;
const BigOverview = styled.div`
  display: flex;
  bottom: 0;
  font-size: 18px;
  text-shadow: 1px 1px 1px black;
  padding: 40px;
  width: 40vw;
  height: 220px;
  line-height: 26px;
  color: ${(props) => props.theme.white.darker};
  top: -150px;
  flex-direction: column;
  text-shadow: 0.3px 0.3px 0.3px white;
  p {
    padding-top: 30px;
    text-shadow: 0.3px 0.3px 0.3px white;
    span {
      padding: 0 20px 0 0;
    }
  }
`;
const SimilarBox = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  gap: 10px 10px;
  padding-top: 10vh;
  background-color: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
  cursor: pointer;
`;

const Similar = styled(motion.div)<{ bgphoto: string }>`
  width: 250px;
  height: 160px;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  border-radius: 15px;
  text-align: center;
`;
const SimilarInfo = styled(motion.div)`
  padding: 10px;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0);
  position: absolute;
  width: 100%;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const rowVariants = {
  hidden: ({ width, turn }: { width: number; turn: boolean }) => ({
    x: turn ? width - 5 : -width + 5,
  }),
  visible: {
    x: 0,
  },
  exit: ({ width, turn }: { width: number; turn: boolean }) => ({
    x: turn ? -width + 5 : width - 5,
  }),
};

const boxVariants = {
  normal: {
    scale: 1,
    borderRadius: "10px 10px 0 0",
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
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: "0 0 5px 5px",
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};
const arrowVariants = {
  start: { opacity: 0 },
  hover: {
    opacity: 1,
    tansition: { duration: 0.5 },
  },
};
const SimilarBoxVariants = {
  normal: {
    scale: 1,
    borderRadius: "5px 5px 5px 5px",
  },
  hover: {
    scale: 1.3,
    y: -30,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const similarInfoVariants = {
  hover: {
    opacity: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: "0 0 5px 5px",
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

function TvCategory({ type }: { type: TvTypes }) {
  const [leaving, setLeaving] = useState(false);
  const [turn, setTurn] = useState(false);
  const [index, setIndex] = useState(0);
  const offset = 6;
  const navigate = useNavigate();
  const width = useWindowDimensions();
  const { scrollY } = useScroll();

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
