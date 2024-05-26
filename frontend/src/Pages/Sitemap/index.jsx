// src/pages/Sitemap/index.jsx

import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import routesConfig from "../../Router/routesConfig";
import "./index.css";

const generateSitemap = (routes, basePath = "") => {
  return routes.map((route, index) => {
    const fullPath = `${basePath}${route.path}`.replace("//", "/");
    if (route.children) {
      return (
        <li key={index} className="sitemap-item">
          <Link to={fullPath} className="sitemap-link">
            {route.name}
          </Link>
          <ul className="sitemap-sublist">
            {generateSitemap(route.children, `${fullPath}/`)}
          </ul>
        </li>
      );
    }
    return (
      <li key={index} className="sitemap-item">
        <Link to={fullPath} className="sitemap-link">
          {route.name}
        </Link>
      </li>
    );
  });
};

const Sitemap = () => {
  return (
    <Container className="sitemap-container">
      <Row>
        <Col>
          <Card className="sitemap-card">
            <Card.Body>
              <Card.Title className="sitemap-title">Sitemap</Card.Title>
              <ul className="sitemap-list">{generateSitemap(routesConfig)}</ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Sitemap;
