import { useState, useEffect } from "react";
import CommonSection from "../../Shared/CommonSection";
import { animateScroll as scroll } from "react-scroll";

import "./index.css";
import TourCard from "../../Shared/TourCard";
import SearchBar from "../../Shared/SearchBar";
import CircularProgress from "../../components/CircularProgress";
import CustomPagination from "../../components/CustomPagination";

import { Container, Row, Col } from "react-bootstrap";

import useFetch from "../../hooks/useFetch";
import { baseUrl } from "../../config";

const Tours = () => {
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { data: tours, isLoading: toursLoading } = useFetch(
    `${baseUrl}/api/v1/tours?page=${page}`
  );
  const { data: tourCount, isLoading: countLoading } = useFetch(
    `${baseUrl}/api/v1/tours/search/getTourCount`
  );
  useEffect(() => {
    if (!toursLoading && !countLoading && tours.length && tourCount) {
      setIsLoading(false);
      const pages = Math.ceil(tourCount / 8);
      setPageCount(pages);
    }
  }, [toursLoading, countLoading, page, tourCount, tours]);

  useEffect(() => {
    scroll.scrollToTop();
  }, []);

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
            {isLoading ? (
              <Container className="d-flex justify-content-center">
                <CircularProgress />
              </Container>
            ) : (
              tours?.map((tour) => (
                <Col lg="3" md="4" sm="6" className="mb-4" key={tour.id}>
                  {" "}
                  <TourCard tour={tour} />
                </Col>
              ))
            )}
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
