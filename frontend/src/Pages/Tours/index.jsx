import React, { useState, useEffect } from "react";
import CommonSection from "../../Shared/CommonSection";

import "./index.css";
import TourCard from "../../Shared/TourCard";
import SearchBar from "../../Shared/SearchBar";
import CircularProgress from "../../components/CircularProgress";
import CustomPagination from "../../components/CustomPagination";

import { Container, Row, Col } from "react-bootstrap";

import useFetch from "../../hooks/useFetch";

const Tours = () => {
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const [isToursLoading, setIsToursLoading] = useState(true);

  const { data: tours, isLoading: toursLoading } = useFetch(
    `http://localhost:4000/api/v1/tours?page=${page}`
  );
  const { data: tourCount, isLoading: countLoading } = useFetch(
    `http://localhost:4000/api/v1/tours/search/getTourCount`
  );
  useEffect(() => {
    if (!toursLoading && !countLoading && tours.length && tourCount) {
      setIsToursLoading(false);
      const pages = Math.ceil(tourCount / 8);
      setPageCount(pages);
    }
    window.scrollTo(0, 0);
  }, [toursLoading, countLoading, page, tourCount, tours]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber - 1);
  };
  return (
    <>
      <CommonSection title={"All Tours"} />
      <section>
        <Container>
          <Row>
            <SearchBar />
          </Row>
        </Container>
      </section>
      <section className="pt-0">
        <Container>
          <Row>
            {isToursLoading && (
              <div className="tours__loading">
                <CircularProgress />
              </div>
            )}
            {tours?.map((tour) => (
              <Col lg="3" className="mb-4" key={tour.id}>
                {" "}
                <TourCard tour={tour} />
              </Col>
            ))}
            {/* <Col lg="12">
              <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
                {[...Array(pageCount).keys()].map((number) => (
                  <span
                    key={number}
                    onClick={() => setPage(number)}
                    className={page === number ? "active__page" : ""}
                  >
                    {number + 1}
                  </span>
                ))}
              </div>
            </Col> */}
            <Col lg="12">
              <CustomPagination
                totalPages={pageCount}
                currentPage={page + 1}
                onChange={handlePageChange}
              />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Tours;
