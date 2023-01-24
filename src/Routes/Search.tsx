import { useEffect } from "react";
import styled from "styled-components";
import { useLocation, useParams } from "react-router-dom";
import { atom, useRecoilState } from "recoil";
import { v1 } from "uuid";
import SearchCategory from "../Components/SearchCategory";
import { getKeyword } from "../atom";
const Wrapper = styled.div`
  width: 95%;
  margin: 100px 0 0 20px;
`;

function Search() {
  // 현재 페이지의 데이터를 가져올 수 있음
  const location = useLocation();
  // URLSearchParams() = get()과 함께 사용하면url내의 데이터에 접근할 수 있다
  const srcParams = new URLSearchParams(location.search);
  const keyword = srcParams.get("keyword");
  // const contentId = new URLSearchParams(location.search).get(":contentId");

  //! search keyword와 contentId가 분리되어야 하는데 같이 묶여서 string으로 전달되어서 useMatch가 작동이 안됨
  // const keyword = location.search.slice(9)
  // const { params } = useParams();

  // console.log(contentId)

  //   console.log(location)
  // console.log(keyword);
  // console.log(contentId)

  // const [searchKeyword, setSearchKeyword] = useRecoilState<any>(getKeyword);

  // useEffect(() => {
  //   setSearchKeyword(keyword);
  // }, [keyword]);

  return (
    <Wrapper>
      <SearchCategory keyword={ keyword } />
    </Wrapper>
  );
}

export default Search;
