import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../Pages/Home/index";

import Tours from "../Pages/Tours/index";

import CommunityForum from "../Pages/CommunityForum/index";
import ForumPosts from "../Pages/CommunityForum/ForumPosts";
import CategoryList from "../Pages/CommunityForum/CategoryList";
import ForumSearch from "../Pages/CommunityForum/ForumSearch";

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
import ResetPassword from  "../Pages/ResetPass/index";
import ForumPostsList from "../Pages/Admin/components/forum-posts/index";
import UsersList from "../Pages/Admin/components/users/index";
import OtherUserProfile from "../Pages/OtherUserProfile/index";
import ConfigPage from "../Pages/ConfigPage";
import ThankYou from "../Pages/ThankYou";
const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="*" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />

      <Route path="/tours" element={<Tours />} />

      <Route path="/forum" element={<CommunityForum />} />
      <Route path="/forum/p/:id" element={<ForumPosts />} />
      <Route path="/forum/c/:category" element={<CategoryList />} />
      <Route path="/search" element={<ForumSearch />} />

      <Route path="/tours/:id" element={<TourDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<Admin />} >
        <Route index element={<Navigate to="users" />} />
        <Route path="forum-posts" element={<ForumPostsList />} />
        <Route path="users" element={<UsersList />} />
      </Route>
      <Route path="/account" element={<UserAccount />} />
      <Route path="/profile/:id" element={<OtherUserProfile />} />
      <Route path="/admin/users/users/:id" element={<OtherUserProfile />} />
      <Route path="/account/profile" element={<Profile />} />
      <Route path="/account/themes" element={<Themes />} /> 
      <Route path="/account/posts" element={<Posts />} />
      <Route path="/account/favorites" element={<Favorites />} />
      <Route path="/history" element={<PurchaseHistory />} />
      <Route path="/tours/search" element={<SearchResultList />} />
      <Route path="/resetPass" element={<ResetPassword />} />
      <Route path="/config-page" element={<ConfigPage />} />
      <Route path="/thank-you" element={<ThankYou />} />
    </Routes>
  );
};

export default Routers;
