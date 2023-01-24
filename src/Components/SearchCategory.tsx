import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import makeImagePath from "../Routes/makeImagePath";
import {
  BASE_PATH,
  API_KEY,
  ISearchMovieProps,
  IMoveDetailProps,
  ISimilar,
} from "../api";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { getKeyword } from "../atom";

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

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  height: 200px;
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-size: cover;
  background-position: center, center;
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
  cursor: pointer;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  gap: 10px 10px;
  padding-top: 10vh;
  background-color: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
`;

const Similar = styled(motion.div)<{ bgphoto: string }>`
  width: 250px;
  height: 160px;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  border-radius: 15px;
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

function SearchCategory({ keyword }: { keyword: string | null }) {
  // const keyword = useRecoilValue(getKeyword)

  const { scrollY } = useScroll();
  // const keyword = useRecoilValue(getKeyword);
  const bigContentMatch = useMatch(`/search/:contentId`);

  console.log(bigContentMatch?.params.contentId);

  // console.log(bigContentMatch?.params)
  // console.log(bigContentMatch?.params.contentId)
  const filmId = Number(bigContentMatch?.params.contentId);

  const [contentDetail, setContentDetail] = useState<IMoveDetailProps>();

  const { data: getMovieDetail, refetch } = useQuery(
    ["searchDetail", filmId],
    async () => {
      return await axios
        .get(`${BASE_PATH}movie/${filmId}?api_key=${API_KEY}`)
        .then((res) => setContentDetail(res.data));
    },
    { enabled: false }
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

  const { data, isLoading } = useQuery<ISearchMovieProps>(
    ["searchMoive", keyword],
    () =>
      axios.get(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`)
  );

  const navigate = useNavigate();

  const onBoxClick = ({ contentId }: { contentId: number }) => {
    navigate(`/search/${contentId}?category=movies&keyword=${keyword}`);
  };

  const goBackHomt = () => {
    navigate(`/search?&keyword=${keyword}`);
  };

  const clickContent = data?.data.results.find(
    (item) => item.id + "" === bigContentMatch?.params.contentId
  );

  return (
    <>
      <Slider>
        <AnimatePresence>
          <Row>
            {data?.data.results
              .slice()
              .sort((a, b) => {
                return b.popularity - a.popularity;
              })
              .map((item: any): any => (
                <BoxWrapper key={item.id}>
                  {item.poster_path ? (
                    <Box
                      layoutId={"search" + item.id + ""}
                      onClick={ async () => {
                        await onBoxClick({ contentId: item.id })
                        refetch()
                      }                        
                    }
                      variants={boxVariants}
                      bgphoto={makeImagePath(item.poster_path, "w500")}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                    >
                      <Info variants={infoVariants}>
                        <InfoBox>
                          <p>{item.original_title}</p>
                          <span>{item.release_date.slice(0, 4)}</span>
                        </InfoBox>
                      </Info>
                    </Box>
                  ) : (
                    <Box
                      variants={boxVariants}
                      bgphoto={makeImagePath(item.poster_path, "w500")}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                    >
                      Image is Preparing
                      <Info variants={infoVariants}>
                        <InfoBox>
                          <p>{item.original_title}</p>
                          <span>{item.release_date.slice(0, 4)}</span>
                        </InfoBox>
                      </Info>
                    </Box>
                  )}
                </BoxWrapper>
              ))}
          </Row>
        </AnimatePresence>
      </Slider>
      <AnimatePresence>
        {bigContentMatch ? (
          <>
            <Overlay
              onClick={goBackHomt}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <BigMovie
              layoutId={"search" + String(bigContentMatch.params.contentId)}
              scrollY={scrollY.get()}
            >
              {clickContent && (
                <>
                  <BigCover
                    bgPhoto={makeImagePath(clickContent.poster_path, "w500")}
                  >
                    <h2>{clickContent.original_title}</h2>
                  </BigCover>
                  <BigOverview>
                    <h2>{clickContent.overview}</h2>
                    <p>
                      <span>⭐{contentDetail?.popularity.toFixed(1)}</span>
                      <span>{contentDetail?.runtime}min</span>
                    </p>
                    <p>
                      {contentDetail?.genres.map((item) => (
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

export default SearchCategory;
