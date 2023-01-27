import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { AnimatePresence, useScroll } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import makeImagePath from "../Routes/makeImagePath";
import {
  BASE_PATH,
  API_KEY,
  ISearchMovieProps,
  IMoveDetailProps,
  ISimilar,
} from "../api";
import {
  Slider,
  Row,
  SearchBox,
  Info,
  InfoBox,
  Overlay,
  BigMovie,
  BigCover,
  BigOverview,
  SimilarBox,
  Similar,
  NowLoading,
  SimilarInfo,
  BoxWrapper,
  NoticeWrapper,
} from "../style/styled";
import {
  boxVariants,
  infoVariants,
  SimilarBoxVariants,
  similarInfoVariants,
} from "../style/variants";

import styled from "styled-components";

function SearchCategory({ keyword }: { keyword: string | null }) {
  const { scrollY } = useScroll();
  const bigContentMatch = useMatch(`/search/:contentId`);
  const filmId = Number(bigContentMatch?.params.contentId);
  const navigate = useNavigate();

  const [contentDetail, setContentDetail] = useState<IMoveDetailProps>();

  const { data, isLoading } = useQuery<ISearchMovieProps>(
    ["searchMoive", keyword],
    () =>
      axios.get(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`)
  );

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
      {isLoading ? (
         
          <NowLoading>Now is Loading</NowLoading>
        ) : data?.data.results[0] ? (
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
                          <SearchBox
                            layoutId={"search" + item.id + ""}
                            onClick={async () => {
                              await onBoxClick({ contentId: item.id });
                              refetch();
                            }}
                            variants={boxVariants}
                            bgphoto={makeImagePath(item.backdrop_path, "w500")}
                            initial="normal"
                            whileHover="hover"
                            transition={{ type: "tween" }}
                          >
                            <Info variants={infoVariants}>
                              <InfoBox>
                                <p>{item.original_title}</p>
                                <span>{item.release_date}</span>
                              </InfoBox>
                            </Info>
                          </SearchBox>
                        ) : (
                          <SearchBox
                            variants={boxVariants}
                            bgphoto={makeImagePath(item.backdrop_path, "w500")}
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
                          </SearchBox>
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
                    layoutId={
                      "search" + String(bigContentMatch.params.contentId)
                    }
                    scrollY={scrollY.get()}
                  >
                    {clickContent && (
                      <>
                        <BigCover
                          bgPhoto={makeImagePath(
                            clickContent.backdrop_path,
                            "w500"
                          )}
                        >
                          <h2>{clickContent.original_title}</h2>
                        </BigCover>
                        <BigOverview>
                          <h2>{clickContent.overview}</h2>
                          <p>
                            <span>
                              ⭐{contentDetail?.popularity.toFixed(1)}
                            </span>
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
                                bgphoto={makeImagePath(
                                  item.backdrop_path,
                                  "w500"
                                )}
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
        )
       : (
        <NoticeWrapper>Sorry, we couldn't find</NoticeWrapper>
      )}
    </>
  );
}

export default SearchCategory;
