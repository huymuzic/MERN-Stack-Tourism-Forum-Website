// src/Router/Routers.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";
import routesConfig from "./routesConfig";

const generateRoutes = (routes, basePath = "") => {
  return routes.map((route, index) => {
    const fullPath = `${basePath}${route.path}`.replace("//", "/");
    if (route.children) {
      return (
        <Route path={fullPath} element={route.element} key={index}>
          {generateRoutes(route.children, `${fullPath}/`)}
        </Route>
      );
    }
    return <Route path={fullPath} element={route.element} key={index} />;
  });
};

const Routers = () => {
  return <Routes>{generateRoutes(routesConfig)}</Routes>;
};

export default Routers;
