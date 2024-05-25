export const routesConfig = [
  { path: "/home", component: "Home/index", name: "Home" },
  { path: "/tours", component: "Tours/index", name: "Tours" },
  {
    path: "/forum",
    component: "CommunityForum/index",
    name: "Community Forum",
  },
  {
    path: "/forum/p/:id",
    component: "CommunityForum/ForumPosts",
    name: "Forum Posts",
  },
  {
    path: "search",
    component: "CommunityForum/ForumSearch",
    name: "Forum Search",
  },
  { path: "/tours/:id", component: "TourDetails/index", name: "Tour Details" },
  { path: "/login", component: "Login/index", name: "Login" },
  { path: "/register", component: "Register/index", name: "Register" },
  {
    path: "/admin",
    component: "Admin/index",
    name: "Admin",
    children: [
      {
        path: "forum-posts",
        component: "Admin/components/forum-posts",
        name: "Forum Posts",
      },
      { path: "users", component: "Admin/components/users", name: "Users" },
      { path: "tours", component: "Admin/components/tours", name: "Tours" },
    ],
  },
  { path: "/my-account", component: "MyAccount/index", name: "My Account" },
  {
    path: "/profile/:id",
    component: "OtherUserProfile/index",
    name: "User Profile",
  },
  {
    path: "/history",
    component: "PurchaseHistory/index",
    name: "Purchase History",
  },
  {
    path: "/tours/search",
    component: "SearchResultList/index",
    name: "Search Result List",
  },
  { path: "/resetPass", component: "ResetPass/index", name: "Reset Password" },
  { path: "/config-page", component: "ConfigPage/index", name: "Config Page" },
  { path: "/thank-you", component: "ThankYou/index", name: "Thank You" },
  {
    path: "/terms-of-service",
    component: "TermsOfService/index",
    name: "Terms of Service",
  },
  {
    path: "/privacy-policy",
    component: "PrivacyPolicy/index",
    name: "Privacy Policy",
  },
];
