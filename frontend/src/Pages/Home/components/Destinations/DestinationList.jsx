import React from "react";
import Destination from "./Destination";
import { Col, Row } from "react-bootstrap";

import useFetch from "../../../../hooks/useFetch";

const DestinationList = () => {
  const { data: topDestinations } = useFetch(
    "http://localhost:4000/api/v1/tours/search/getTopDestinations"
  );

  const firstHalf = [];
  const secondHalf = [];

  for (let i = 0; i < topDestinations.length; i++) {
    if (i < 5) {
      firstHalf.push(topDestinations[i]);
    } else {
      secondHalf.push(topDestinations[i]);
    }
  }

  return (
    <>
      <Row className="destination-list-1">
        {firstHalf.map((item, index) => (
          <Col key={index}>
            <Destination item={item} />
          </Col>
        ))}
      </Row>
      <Row className="destination-list-2">
        {secondHalf.map((item, index) => (
          <Col key={index}>
            <Destination item={item} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default DestinationList;
