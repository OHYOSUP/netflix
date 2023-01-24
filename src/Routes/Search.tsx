import styled from "styled-components";
import { useLocation } from "react-router-dom";
import SearchCategory from "../Components/SearchCategory";
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

  return (
    <Wrapper>
      <SearchCategory keyword={keyword} />
    </Wrapper>
  );
}

export default Search;
