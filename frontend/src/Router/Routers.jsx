import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { routesConfig } from './routesConfig';
import Sitemap from '../Pages/Sitemap';

const loadComponent = (componentPath) => {
  return lazy(() =>
    import(`../Pages/${componentPath}`).catch(() => import(`../Pages/${componentPath}`))
  );
};

const generateRoutes = (routes, parentPath = '') => {
  return routes.map((route, index) => {
    const fullPath = parentPath ? `${parentPath}/${route.path}` : route.path;
    const Component = loadComponent(route.component);

    if (route.children) {
      return (
        <Route key={index} path={route.path} element={<Component />}>
          <Route index element={<Navigate to={`${route.path}/${route.children[0].path}`} />} />
          {generateRoutes(route.children, route.path)}
        </Route>
      );
    }
    return <Route key={index} path={fullPath} element={<Component />} />;
  });
};

const Routers = () => {
  return (
    <Suspense >
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="*" element={<Navigate to="/home" />} />
        {generateRoutes(routesConfig)}
        <Route path="/sitemap" element={<Sitemap />} />
      </Routes>
    </Suspense>
  );
};

export default Routers;
