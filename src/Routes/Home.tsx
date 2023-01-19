import { useQuery } from "react-query";
import { getNowPlayingMovies, IGetMoivesResult, Types} from "../api";
import styled from "styled-components";
import makeImagePath from "./makeImagePath";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
const Categories = styled.h2`
  font-size: 28px;
  font-weight: 450;
  padding-left: 40px;
`;

function Home() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery<IGetMoivesResult>(
    ["movies", "nowPlaying"],
    () => getNowPlayingMovies(Types.now_playing)
  );

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
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].original_title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
            <DetailedInfo onClick={() => onDetailClick(movieID as number)}>
              상세정보
            </DetailedInfo>
          </Banner>
          <Categories>Now playing</Categories>
          <Category type={Types.now_playing}></Category>
          <Categories>Popular</Categories>
          <Category type={Types.popular}></Category>
          <Categories>TOP RATED</Categories>
          <Category type={Types.top_rated}></Category>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
