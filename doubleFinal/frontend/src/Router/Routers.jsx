import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../Pages/Home";
import Tours from "../Pages/Tours";
import CommunityForum from "../Pages/CommunityForum";
import TourDetails from "../Pages/TourDetails";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Admin from "../Pages/Admin";
import UserAccount from "../Pages/UserAccount";
import Profile from "../Account-Pages/Profile";
import Themes from "../Account-Pages/Themes";
import Favorites from "../Account-Pages/Favorites";
import Posts from "../Account-Pages/UserPosts";
import PurchaseHistory from "../Pages/PurchaseHistory";
import SearchResultList from "../Pages/SearchResultList";

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
