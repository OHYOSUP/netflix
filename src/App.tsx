import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/Netflix-clone" element={<Home />}></Route>
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
