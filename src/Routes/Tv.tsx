import { useState } from "react";
import TvCategory from "../Components/TvCategory";
import { useNavigate, useMatch } from "react-router-dom";
import { useQuery } from "react-query";
import {
  getTvOnTheAir,
  TvTypes,
  ITvOnTheAirProps,
  BASE_PATH,
  API_KEY,
  ITvDetailProps,
} from "../api";
import axios from "axios";
import styled from "styled-components";
import makeImagePath from "./makeImagePath";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Overlay, BigMovie, BigCover, BigOverview } from "../style/styled";
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
  font-weight: 500;
  margin-bottom: 20px;
  text-shadow: 1px 1px 1px black;
  margin-left: 50px;
`;
const Overview = styled.p`
  font-size: 24px;
  line-height: 32px;
  width: 40%;
  font-weight: 500;
  text-shadow: 1px 1px 1px black;
  margin: 50px;
`;
const DetailedInfo = styled(motion.div)`
  width: 7vw;
  height: 5vh;
  border-radius: 5px;
  background-color: ${(props) => props.theme.black.lighter};
  color: ${(props) => props.theme.white.lighter};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0 0 50px;
`;
const Categories = styled.h2`
  font-size: 28px;
  font-weight: 450;
  padding-left: 40px;
`;

function Tv() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const { data, isLoading } = useQuery<ITvOnTheAirProps>(
    ["movies", TvTypes.popular],
    () => getTvOnTheAir(TvTypes.popular)
  );

  const programID = data?.results[0].id;
  const bigProgramMatch = useMatch(`/tv/${TvTypes.popular}/${programID}`);

  const [getDetailData, setDetailData] = useState<ITvDetailProps>();

  const { data: detailData, refetch: detailRefetch } = useQuery(
    ["tvDetail", programID],
    () => {
      axios
        .get(`${BASE_PATH}tv/${programID}?api_key=${API_KEY}&language=en-US`)
        .then((res) => setDetailData(res.data));
    },
    { enabled: false }
  );

  const onDetailClick = (programID: number) => {
    navigate(`/tv/${TvTypes.popular}/${programID}`);
  };
  const goBackHomt = () => {
    navigate(`/tv`);
  };
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Now is Loading</Loader>
      ) : (
        <Banner
          bgPhoto={makeImagePath(data?.results[0].backdrop_path || "", "w500")}
        >
          <Title>{data?.results[0].original_name}</Title>
          <Overview>{data?.results[0].overview}</Overview>
          <DetailedInfo
            onClick={() => {
              onDetailClick(programID as number);
              detailRefetch();
            }}
          >
            Detail
          </DetailedInfo>
        </Banner>
      )}
      <Categories>Top Rated</Categories>
      <TvCategory type={TvTypes.top_rated} />
      <Categories>On_the_air</Categories>
      <TvCategory type={TvTypes.on_the_air} />
      <Categories>Popular</Categories>
      <TvCategory type={TvTypes.popular} />
      <AnimatePresence>
        {bigProgramMatch ? (
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
                          data?.results[0].backdrop_path + "",
                          "w500"
                        )}
                      >
                        <h2>{data?.results[0].original_name}</h2>
                      </BigCover>
                      <BigOverview>
                        <h2>{data?.results[0].overview}</h2>
                        <p>
                          <span>⭐{data.results[0].vote_average}</span>
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
          </>
        ) : null}
      </AnimatePresence>
    </Wrapper>
  );
}

export default Tv;
