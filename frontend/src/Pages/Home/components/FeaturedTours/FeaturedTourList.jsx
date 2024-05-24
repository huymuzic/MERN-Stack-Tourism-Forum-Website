import TourCard from "../../../../Shared/TourCard";
import { Col, Container } from "react-bootstrap";

import calculateAvgRating from "../../../../utils/avgRating";
import useFetch from "../../../../hooks/useFetch";
import CircularProgress from "../../../../components/CircularProgress";
import { baseUrl } from "../../../../config";

const FeaturedTourList = () => {
  const { data: featuredTours, loading } = useFetch(
    `${baseUrl}/api/v1/tours/search/getFeaturedTours`
  );

  const sortedTours = featuredTours
    ? featuredTours.sort((a, b) => {
        const avgRatingA = calculateAvgRating(a.reviews).avgRating;
        const avgRatingB = calculateAvgRating(b.reviews).avgRating;
        return avgRatingB - avgRatingA;
      })
    : [];

  return (
    <>
      {loading ? (
        <Container className="d-flex justify-content-center">
          <CircularProgress />
        </Container>
      ) : (
        sortedTours?.map((tour) => (
          <Col lg="3" md="4" sm="6" className="mb-4" key={tour._id}>
            <TourCard tour={tour} />
          </Col>
        ))
      )}
    </>
  );
};

export default FeaturedTourList;
