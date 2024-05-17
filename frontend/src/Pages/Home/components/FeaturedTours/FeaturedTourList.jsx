import React from "react";
import TourCard from "../../../../Shared/TourCard";
import { Col } from "react-bootstrap";

import useFetch from "../../../../hooks/useFetch";

const FeaturedTourList = () => {
  const { data: featuredTours } = useFetch(
    "http://localhost:4000/api/v1/tours/search/getFeaturedTours"
  );

  return (
    <>
      {featuredTours?.map((tour) => (
        <Col lg="3" className="mb-4" key={tour._id}>
          <TourCard tour={tour} />
        </Col>
      ))}
    </>
  );
};

export default FeaturedTourList;
