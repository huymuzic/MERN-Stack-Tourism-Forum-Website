import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { routesConfig } from '../../Router/routesConfig';
import './index.css';

const generateList = (routes, parentPath = '') => {
  return routes.map((route, index) => {
    const fullPath = `${parentPath}${route.path}`.replace('//', '/'); // Ensure no double slashes
    if (route.children) {
      return (
        <li key={index} className="sitemap-item">
          <a href={fullPath} className="sitemap-link">{route.name}</a>
          <ul className="sitemap-sublist">
            {generateList(route.children, `${fullPath}/`)}
          </ul>
        </li>
      );
    }
    return (
      <li key={index} className="sitemap-item">
        <a href={fullPath} className="sitemap-link">{route.name}</a>
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
              <ul className="sitemap-list">
                {generateList(routesConfig)}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Sitemap;
