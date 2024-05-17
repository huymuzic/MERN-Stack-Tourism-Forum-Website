import React from "react";
import { useLocation } from "react-router-dom";

import Header from "../Header/Header";
import Routers from "../../Router/Routers";
import Footer from "../Footer/Footer";
import "./index.css";

import CircularProgress from "../../components/CircularProgress";
import ForumHeader from "../ForumHeader/ForumHeader";
import CookieBanner from "../../Pages/Home/components/CookieBanner/index.jsx";

const Layout = ({ isLoading }) => {
  const location = useLocation();

  if (
    location.pathname.startsWith("/forum") ||
    location.pathname === "/search" ||
    location.pathname.startsWith("/users") ||
    location.pathname.startsWith("/profile")
  ) {
    return (
      <ForumHeader>
        <Routers />
        <CookieBanner />
      </ForumHeader>
    );
  }

  return (
    <>
      {isLoading && (
        <div className="home__loading">
          <CircularProgress />
        </div>
      )}
      <Header />
      <Routers />
      <Footer />
      <CookieBanner />
    </>
  );
};

export default Layout;
