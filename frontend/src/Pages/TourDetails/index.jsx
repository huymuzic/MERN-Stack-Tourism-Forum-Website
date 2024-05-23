import { useRef, useState, useEffect } from "react";
import "./index.css";
import { Link, Element, animateScroll as scroll } from "react-scroll";
import { Container, Row, Col, Form, ListGroup } from "react-bootstrap";
import { useParams } from "react-router-dom";
import calculateAvgRating from "../../utils/avgRating";
import Booking from "./components/Booking";
import { pushError, pushSuccess } from "../../components/Toast";
import { useUser } from "../../utils/UserContext";
import { getAvatarUrl } from "../../utils/getAvar.js";
import useFetch from "../../hooks/useFetch.jsx";
import { baseUrl } from "../../config/index.js";
import { environment } from "../../config/index.js";
import { useTheme } from "../../theme/Theme.jsx";

const TourDetails = () => {
  const { user } = useUser();
  const { id } = useParams();
  const reviewMsgRef = useRef("");
  const [tourRating, setTourRating] = useState(null);
  const [reviewsArray, setReviewsArray] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [avgRating, setAvgRating] = useState("");
  const [totalRating, setTotalRating] = useState(0);
  const { color } = useTheme()
  const { data: tour } = useFetch(`${baseUrl}/api/v1/tours/${id}`);

  const { photo, title, price, reviews, country, city, duration, ageRange } =
    tour || {};

  useEffect(() => {
    if (tour && reviews) {
      setReviewsArray(reviews);
      setReviewCount(reviews.length);
    }
  }, [tour, reviews]);

  useEffect(() => {
    scroll.scrollToTop();
  }, []);

  useEffect(() => {
    if (reviewsArray.length > 0) {
      const { avgRating, totalRating } = calculateAvgRating(reviewsArray);
      setAvgRating(avgRating);
      setTotalRating(totalRating);
    }
  }, [reviewsArray]);

  // format date
  const options = { day: "numeric", month: "long", year: "numeric" };

  // submit request to the server
  const submitHandler = async (e) => {
    e.preventDefault();
    const reviewText = reviewMsgRef.current.value;
    if (!user) {
      pushError("Please login to submit a review");
      return;
    }
    if (!tourRating) {
      pushError("Please rate the tour");
      return;
    }
    try {
      const res = await fetch(`${baseUrl}/api/v1/reviews/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewText: reviewText,
          rating: tourRating,
        }),
      });
      if (res.ok) {
        const newReview = await res.json();
        pushSuccess("Review submitted successfully");
        setReviewsArray([...reviewsArray, newReview.data]);
        setReviewCount(reviewCount + 1);
        setTourRating(null);
      } else {
        throw new Error("Failed to submit review");
      }
    } catch (err) {
      pushError("Something went wrong");
      pushError("Please try again later");
    }
  };
  return (
    <>
      <section>
        <Container>
          <Row>
            <Col lg="8">
              <div className="tour__content">
                <Element name="section1">
                  <h2>{title}</h2>
                </Element>

                <div className="d-flex align-items-center gap-2">
                  <span className="tour__rating d-flex align-items-center gap-1">
                    <i className="ri ri-star-s-fill"></i>{" "}
                    {avgRating === 0 ? null : avgRating}
                    {totalRating === 0 ? (
                      "Not rated"
                    ) : (
                      <span>({reviewCount})</span>
                    )}
                  </span>
                  <span>|</span>
                  <span>
                    <i className="ri-map-pin-2-line"></i> {city}, {country}
                  </span>
                </div>
                <img
                  src={environment == "PROD" ? photo : `./src${photo}`}
                  alt={title}
                />
                <div className="tour__info" style={{ color: color.textPrimary }}>
                  <div className="d-flex flex-column align-items-start justify-content-center tour__extra-details">
                    <h5>Description</h5>
                    <div>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Corrupti ipsam dolorem provident ex earum quis, corporis
                      quisquam eius quasi exercitationem.
                    </div>
                    <span>
                      <i className="ri-money-dollar-circle-line "></i>from $
                      {price} / adult
                    </span>
                    <hr className="col-12 mx-auto custom-hr"></hr>
                    <span>
                      <i className="ri-group-line"></i>Age {ageRange}
                    </span>
                    <span>
                      <i className="ri-time-line"></i>Duration: {duration} days
                    </span>
                    <span>
                      <i className="fa-light fa-bed-front"></i>Accommodation
                      included
                    </span>
                    <hr className="col-12 mx-auto custom-hr"></hr>
                    <span>FAQ</span>
                    <hr className="col-12 mx-auto custom-hr"></hr>
                  </div>
                </div>

                {/* ============ tour reviews section ================= */}
                <div className="tour__reviews mt-4">
                  <h4>Reviews ({reviewCount} reviews)</h4>

                  <Form onSubmit={submitHandler}>
                    <div className="d-flex align-items-center justify-content-end gap-3 mb-4 rating__group">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} onClick={() => setTourRating(i + 1)}>
                          <i
                            className={`ri ${i < tourRating ? "ri-star-s-fill" : "ri-star-line"
                              }`}
                          ></i>
                        </span>
                      ))}
                    </div>

                    <div className="review__input" style={{ border: `1px solid ${color.secondary}` }}>
                      <input
                        type="text"
                        ref={reviewMsgRef}
                        placeholder="Share your thoughts..."
                        required
                        style={{ backgroundColor: "inherit" }}
                      ></input>
                      <button
                        className="btn primary__btn btn-primary"
                        type="submit"
                      >
                        Submit
                      </button>
                    </div>
                  </Form>

                  <ListGroup className="user__reviews">
                    {reviewsArray.map((review) => (
                      <div className="review__item" key={review._id}>
                        <img
                          src={getAvatarUrl(review.avatar, baseUrl)}
                          alt="User Avatar"
                          className="rounded-circle"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />

                        <div className="w-100">
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              <h5>{review.username}</h5>
                              <p>
                                {new Date(review.createdAt).toLocaleDateString(
                                  "en-US",
                                  options
                                )}
                              </p>
                            </div>
                            <span className="d-flex align-items-center">
                              {review.rating}
                              <i className="ri ri-star-s-fill"></i>
                            </span>
                          </div>
                          <h6>{review.reviewText}</h6>
                        </div>
                      </div>
                    ))}
                  </ListGroup>
                </div>
                {/* ============ tour reviews section ends ================= */}
              </div>
            </Col>

            <Col lg="4">
              <Booking tour={tour} avgRating={avgRating} />
            </Col>
          </Row>
        </Container>
      </section>
      {/* Links to sections */}
      <Link to="section1" smooth={true} duration={500}></Link>
    </>
  );
};

export default TourDetails;
