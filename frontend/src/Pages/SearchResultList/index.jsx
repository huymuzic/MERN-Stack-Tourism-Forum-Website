import { useState, useEffect } from "react";
import CommonSection from "../../Shared/CommonSection";
import { Container, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import TourCard from "../../Shared/TourCard";
import SearchBar from "../../Shared/SearchBar";
import { Link as ScrollLink, Element, scroller } from "react-scroll";

const SearchResultList = () => {
  const location = useLocation();
  const [data, setData] = useState(location.state);

  useEffect(() => {
    setData(location.state);
  }, [location.state]);

  useEffect(() => {
    scroller.scrollTo("section1", {
      duration: 500,
      delay: 0,
      smooth: "easeInOut",
    });
  }, []);

  return (
    <>
      <CommonSection title={"Tour Search Result"} />
      <section>
        <Element name="section1">
          <Container>
            <Row>
              <SearchBar />
            </Row>
          </Container>
        </Element>
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
      {/* Links to sections */}
      <ScrollLink to="section1" smooth={true} duration={500}></ScrollLink>
    </>
  );
};

export default SearchResultList;
