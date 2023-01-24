import React from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";
import { useRecoilValue } from "recoil";
import { getKeyword } from "./atom";
import SearchCategory from "./Components/SearchCategory";

function App() {
  const keyword = useRecoilValue(getKeyword);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/movies/:category/:movieId" element={<Home />}></Route>

        <Route path="/search" element={<Search />}>
          <Route path=":contentId" element={<Search />}></Route>
        </Route>

        <Route path="/tv" element={<Tv />}></Route>
        <Route path="/tv/:tvcategory/:programId" element={<Tv />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
