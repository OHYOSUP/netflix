import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { AnimatePresence, useScroll } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import makeImagePath from "../Routes/makeImagePath";
import { BASE_PATH, API_KEY, ISearchTvProps, ITvDetailProps } from "../api";
import {
  Slider,
  Row,
  Info,
  InfoBox,
  Overlay,
  BigMovie,
  BigCover,
  BigOverview,
  SearchBox,
  BoxWrapper,
} from "../style/styled";
import { boxVariants, infoVariants } from "../style/variants";

function SearchTv({ keyword }: { keyword: string | null }) {
  const { scrollY } = useScroll();
  const bigContentMatch = useMatch(`/search/:contentId`);
  const programId = Number(bigContentMatch?.params.contentId);
  const navigate = useNavigate();

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

  const { data, isLoading } = useQuery<ISearchTvProps>(
    ["searchTv", keyword],
    () =>
      axios.get(`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}`)
  );

  const onBoxClick = ({ contentId }: { contentId: number }) => {
    navigate(`/search/${contentId}?category=tv&keyword=${keyword}`);
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
                    <SearchBox
                      layoutId={"search" + item.id + ""}
                      onClick={async () => {
                        await onBoxClick({ contentId: item.id });
                        detailRefetch();
                      }}
                      variants={boxVariants}
                      bgphoto={makeImagePath(item.backdrop_path, "w500")}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                    >
                      <Info variants={infoVariants}>
                        <InfoBox>
                          <p>{item.original_name}</p>
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
                          <p>{item.original_name}</p>
                          <span>{item.release_date}</span>
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
              layoutId={"search" + String(bigContentMatch.params.contentId)}
              scrollY={scrollY.get()}
            >
              {clickContent && (
                <>
                  <BigCover
                    bgPhoto={makeImagePath(clickContent.backdrop_path, "w500")}
                  >
                    <h2>{clickContent.original_name}</h2>
                  </BigCover>
                  <BigOverview>
                    <h2>{clickContent.overview}</h2>
                    <p>
                      <span>⭐{getDetailData?.vote_average.toFixed(1)}</span>
                      <span>{getDetailData?.runtime}min</span>
                    </p>
                    <p>
                      {getDetailData?.genres.map((item) => (
                        <span key={item.id}>{item.name}</span>
                      ))}
                    </p>
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

export default SearchTv;
