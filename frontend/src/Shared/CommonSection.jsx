import React, { useState, useEffect } from "react";
import "./common-section.css";

import { Container, Row, Col } from "react-bootstrap";
import { baseUrl } from "../config";

const CommonSection = ({ title }) => {
  const [commonSectionImage, setCommonSectionImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${baseUrl}/api/v1/images/`
      );
      const Images = await response.json();

      if (Images && Images.data) {
        const image = Images.data.find(
          (item) => item.title === "Common Section Image"
        );
        if (image) {
          setCommonSectionImage(image.photo);
        }
      }
    };
    fetchData();
  }, []);

  const sectionStyle = commonSectionImage
    ? {
        background: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${commonSectionImage}) no-repeat center center`,
        backgroundSize: "cover",
      }
    : {};

  return (
    <section className="common__section" style={sectionStyle}>
      <Container>
        <Row>
          <Col lg="12">
            <h1>{title}</h1>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CommonSection;
