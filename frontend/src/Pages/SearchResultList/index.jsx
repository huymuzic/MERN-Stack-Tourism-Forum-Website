import React, { useState, useEffect } from "react";
import CommonSection from "../../Shared/CommonSection";
import { Container, Row, Col } from "react-bootstrap";

import { useLocation } from "react-router-dom";
import TourCard from "../../Shared/TourCard";
import SearchBar from "../../Shared/SearchBar";

const SearchResultList = () => {
  const location = useLocation();
  const [data, setData] = useState(location.state);

  useEffect(() => {
    setData(location.state);
  }, [location.state]);

  return (
    <>
      <CommonSection title={"Tour Search Result"} />
      <section>
        <Container>
          <Row>
            <SearchBar />
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            {data.length === 0 ? (
              <h4 className="text-center">No tour found</h4>
            ) : (
              data?.map((tour) => (
                <Col lg="3" className="mb-4" key={tour._id}>
                  <TourCard tour={tour} />{" "}
                </Col>
              ))
            )}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default SearchResultList;
