import React from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import MainPage from "./pages/MainPage";
import DetailPage from "./pages/DetailPage";
import LoginPage from "./pages/LoginPage";
import NavBar from "./pages/NavBar";
import PokedexPage from "./pages/PokeDexPage";

const Layout = () => {
  return (
    <>
      <NavBar />
      <br />
      <br />
      <br />
      <Outlet />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path='/pokemon/:id' element={<DetailPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/pokedex' element={<PokedexPage />} />
          <Route path='*' element={<Navigate to={"/"} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
