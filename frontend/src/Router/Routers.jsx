import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../Pages/Home/index";
import Tours from "../Pages/Tours/index";
import CommunityForum from "../Pages/CommunityForum/index";
import TourDetails from "../Pages/TourDetails/index";
import Login from "../Pages/Login/index";
import Register from "../Pages/Register/index";
import Admin from "../Pages/Admin/index";
import UserAccount from "../Pages/Account/index";
import Profile from "../Pages/Account/components/Profile";
import Themes from "../Pages/Account/components/Themes";
import Favorites from "../Pages/Account/components/Favorites";
import Posts from "../Pages/Account/components/UserPosts";
import PurchaseHistory from "../Pages/PurchaseHistory/index";
import SearchResultList from "../Pages/SearchResultList/index";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/forum" element={<CommunityForum />} />
      <Route path="/tours/:id" element={<TourDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/account" element={<UserAccount />} />
      <Route path="/account/profile" element={<Profile />} />
      <Route path="/account/themes" element={<Themes />} />
      <Route path="/account/posts" element={<Posts />} />
      <Route path="/account/favorites" element={<Favorites />} />      
      <Route path="/history" element={<PurchaseHistory />} />
      <Route path="/tours/search" element={<SearchResultList />} />
    </Routes>
  );
};

export default Routers;
