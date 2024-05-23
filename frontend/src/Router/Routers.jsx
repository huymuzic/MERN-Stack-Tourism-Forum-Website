import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../Pages/Home/index";

import Tours from "../Pages/Tours/index";

import CommunityForum from "../Pages/CommunityForum/index";
import ForumPosts from "../Pages/CommunityForum/ForumPosts";
import ForumSearch from "../Pages/CommunityForum/ForumSearch";

import TourDetails from "../Pages/TourDetails/index";
import Login from "../Pages/Login/index";
import Register from "../Pages/Register/index";
import Admin from "../Pages/Admin/index";
import PurchaseHistory from "../Pages/PurchaseHistory/index";
import SearchResultList from "../Pages/SearchResultList/index";
import ResetPassword from "../Pages/ResetPass/index";
import ForumPostsList from "../Pages/Admin/components/forum-posts/index";
import UsersList from "../Pages/Admin/components/users/index";
import ToursList from  "../Pages/Admin/components/tours/index";
import OtherUserProfile from "../Pages/OtherUserProfile/index";
import ConfigPage from "../Pages/ConfigPage";
import ThankYou from "../Pages/ThankYou";
import TermsOfService from "../Pages/TermsOfService/index";
import PrivacyPolicy from "../Pages/PrivacyPolicy/index";
import MyAccount from "../Pages/MyAccount";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="*" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />

      <Route path="/tours" element={<Tours />} />

      <Route path="/forum" element={<CommunityForum />} />
      <Route path="/forum/p/:id" element={<ForumPosts />} />
      <Route path="/search" element={<ForumSearch />} />

      <Route path="/tours/:id" element={<TourDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<Admin />}>
        <Route index element={<Navigate to="users" />} />
        <Route path="forum-posts" element={<ForumPostsList />} />
        <Route path="users" element={<UsersList />} />
        <Route path="tours" element={<ToursList />} />
      </Route>
      <Route path="/my-account" element={<MyAccount />} />
      <Route path="/profile/:id" element={<OtherUserProfile />} />
      <Route path="/admin/users/users/:id" element={<OtherUserProfile />} />
      <Route path="/history" element={<PurchaseHistory />} />
      <Route path="/tours/search" element={<SearchResultList />} />
      <Route path="/resetPass" element={<ResetPassword />} />
      <Route path="/config-page" element={<ConfigPage />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    </Routes>
  );
};

export default Routers;
