
import styled from "styled-components";
import {motion} from 'framer-motion'

export const NowLoading = styled.div`
margin: 30px;
padding-top : 50px;
color: ${props=> props.theme.white.lighter};
font-size: 30px;
`
export const Slider = styled(motion.div)`
  position: relative;
  margin-bottom: 150px;
  padding: 40px;
  top: 0;
  height: 180px;
`;


export const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

// bgphto prop이 추가되었으니 typescript에게 타입 알려주기
export const Box = styled(motion.div)<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  height: 200px;
  font-size: 66px;
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

export const NoticeWrapper = styled.div`
  margin: 30px;
  padding-top : 50px;
  color: #c23616;
  font-size: 30px;
`;

export const SearchBox = styled(motion.div)<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  background-size: cover;
  background-position: center, center;
  font-size : 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:first-child {
    transform-origin: center center;
  }
  &:last-child {
    transform-origin: center center;
  }
`;

export const Info = styled(motion.div)`
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

export const InfoBox = styled.div`
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
export const LeftArrow = styled(motion.div)`
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
export const RightArrow = styled(motion.div)`
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


export const Overlay = styled(motion.div)`
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0;
`;
export const BigMovie = styled(motion.div)<{ scrollY: number }>`
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

export const BigCover = styled.div<{ bgPhoto: string }>`
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
export const BigOverview = styled.div`
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
      font-style : italic;
    }
  }
`;
export const SimilarBox = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  gap: 10px 10px;
  padding-top: 10vh;
  background-color: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
`;

export const Similar = styled(motion.div)<{ bgphoto: string }>`
  width: 250px;
  height: 160px;
  cursor: pointer;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  border-radius: 15px;
`;
export const SimilarInfo = styled(motion.div)`
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
export const BoxWrapper = styled.div`
  background: black;
`;