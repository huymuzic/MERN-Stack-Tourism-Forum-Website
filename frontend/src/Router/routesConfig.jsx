// src/routesConfig.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import Home from '../Pages/Home';
import Tours from '../Pages/Tours';
import CommunityForum from '../Pages/CommunityForum';
import ForumPosts from '../Pages/CommunityForum/ForumPosts';
import ForumSearch from '../Pages/CommunityForum/ForumSearch';
import TourDetails from '../Pages/TourDetails';
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import Admin from '../Pages/Admin';
import PurchaseHistory from '../Pages/PurchaseHistory';
import SearchResultList from '../Pages/SearchResultList';
import ResetPassword from '../Pages/ResetPass';
import ForumPostsList from '../Pages/Admin/components/forum-posts';
import UsersList from '../Pages/Admin/components/users';
import OtherUserProfile from '../Pages/OtherUserProfile';
import ConfigPage from '../Pages/ConfigPage';
import ThankYou from '../Pages/ThankYou';
import TermsOfService from '../Pages/TermsOfService';
import PrivacyPolicy from '../Pages/PrivacyPolicy';
import MyAccount from '../Pages/MyAccount';
import Checkout from '../Pages/Checkout';
import ToursList from '../Pages/Admin/components/tours';
import Sitemap from '../Pages/Sitemap';

const routesConfig = [
  { path: "/", element: <Navigate to="/home" /> },
  { path: "*", element: <Navigate to="/home" /> },
  { path: "/home", element: <Home />, name: "Home" },
  { path: "/tours", element: <Tours />, name: "Tours" },
  { path: "/forum", element: <CommunityForum />, name: "Community Forum" },
  { path: "/forum/p/:id", element: <ForumPosts />, name: "Forum Posts" },
  { path: "/search", element: <ForumSearch />, name: "Forum Search" },
  { path: "/tours/:id", element: <TourDetails />, name: "Tour Details" },
  { path: "/login", element: <Login />, name: "Login" },
  { path: "/register", element: <Register />, name: "Register" },
  {
    path: "/admin",
    element: <Navigate to="/admin/users" />,
  },
  {
    path: "/admin",
    element: <Admin />,
    name: "Admin",
    children: [
      { path: "users", element: <UsersList />, name: "Users" },
      { path: "forum-posts", element: <ForumPostsList />, name: "Forum Posts" },
      { path: "tours", element: <ToursList />, name: "Tours" },
    ],
  },
  { path: "/my-account", element: <MyAccount />, name: "My Account" },
  { path: "/profile/:id", element: <OtherUserProfile />, name: "User Profile" },
  { path: "/history", element: <PurchaseHistory />, name: "Purchase History" },
  { path: "/tours/search", element: <SearchResultList />, name: "Search Result List" },
  { path: "/resetPass", element: <ResetPassword />, name: "Reset Password" },
  { path: "/config-page", element: <ConfigPage />, name: "Config Page" },
  { path: "/thank-you", element: <ThankYou />, name: "Thank You" },
  { path: "/terms-of-service", element: <TermsOfService />, name: "Terms of Service" },
  { path: "/privacy-policy", element: <PrivacyPolicy />, name: "Privacy Policy" },
  { path: "/checkout", element: <Checkout />, name: "Checkout" },
  { path: "/sitemap", element: <Sitemap />, name: "Sitemap" },
];

export default routesConfig;
