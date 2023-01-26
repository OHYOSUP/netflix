import styled from "styled-components";
import { useState } from "react";
import { turnContent } from "../atom";
import { useSetRecoilState, useRecoilState } from "recoil";
import { useLocation } from "react-router-dom";
import SearchCategory from "../Components/SearchCategory";
import SearchTv from "../Components/SearchTv";
import { Variant, AnimatePresence, motion } from "framer-motion";
const Wrapper = styled.div`
  width: 95%;
  margin: 100px 0 0 20px;
`;
const SearchHeader = styled(motion.div)`
  width: 15vw;
  display: flex;
  justify-content: space-between;
  padding-left: 40px;
  font-size: 24px;
`;
const BtnWrapper = styled(motion.div)`
  cursor: pointer;
  color: #718093;
`;


function Search() {
  // const [toggleContent, setToggleContent] = useState<boolean>(true);

  const [toggleContent, setToggleContent] = useRecoilState(turnContent);
  // 현재 페이지의 데이터를 가져올 수 있음
  const location = useLocation();
  // URLSearchParams() = get()과 함께 사용하면url내의 데이터에 접근할 수 있다
  const srcParams = new URLSearchParams(location.search);
  const keyword = srcParams.get("keyword");

  const btnVariants = {
    start: {
      scale: 0.8,
      opacity: 0.5,
    },
    end: ({ toggleContent }: { toggleContent: boolean }) => ({
      color: toggleContent ? "#fff" : "#718093",
      opacity: toggleContent ? 1 : 0.5,
      scale: toggleContent ? 1.2 : 0.8,
      transition: {
        duration: 0.3,
        type: "tween",
      },
    }),
    hover: {
      color: "#fff",
      opacity: 1,
      scale: 1.2,
      transition: {
        duration: 0.3,
        type: "tween",
      },
    },
  };

  return (
    <Wrapper>
      <AnimatePresence>
        <SearchHeader>
          <BtnWrapper
            variants={btnVariants}
            initial="start"
            animate="end"
            whileHover="hover"
            custom={{ toggleContent }}
            transition={{ type: "tween" }}
            onClick={() => setToggleContent(true)}
          >
            MOVIES
          </BtnWrapper>
          <BtnWrapper
            variants={btnVariants}
            initial="start"
            animate="end"
            whileHover="hover"
            transition={{ type: "tween" }}
            custom={{ toggleContent: !toggleContent }}
            onClick={() => setToggleContent(false)}
          >
            SERIES
          </BtnWrapper>
        </SearchHeader>
      </AnimatePresence>
      {toggleContent ? (
        <SearchCategory keyword={keyword} />
      ) : (
        <SearchTv keyword={keyword} />
      )}
    </Wrapper>
  );
}

export default Search;
