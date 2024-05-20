import React from "react";
import Destination from "./Destination";
import { Col, Row, Container } from "react-bootstrap";

import useFetch from "../../../../hooks/useFetch";
import CircularProgress from "../../../../components/CircularProgress";
import { baseUrl } from "../../../../config";

const DestinationList = () => {
  const { data: topDestinations, loading } = useFetch(
    `${baseUrl}/api/v1/tours/search/getTopDestinations`
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
      {loading ? (
        <Container className="d-flex justify-content-center">
          <CircularProgress />
        </Container>
      ) : (
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
      )}
    </>
  );
};

export default DestinationList;
