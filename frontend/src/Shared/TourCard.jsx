import { Card, CardBody } from "react-bootstrap";
import { Link } from "react-router-dom";
import calculateAvgRating from "../utils/avgRating";
import "./tour-card.css";
import { environment } from "../config";
import { baseUrl } from "../config/index.js";
const TourCard = ({ tour }) => {
  const { _id, title, country, city, price, photo, featured, reviews } = tour;

  const { totalRating, avgRating } = calculateAvgRating(reviews);

  return (
    <div className="tour__card">
      <Card className="card__tour">
        <div className="tour__img">
          <Link to={`/tours/${_id} `}>
            <img
              src={`${baseUrl}/api/v1/tours/images/${photo}`}
              alt={title}
            />
            {featured && <span>Featured</span>}
          </Link>
        </div>

        <CardBody>
          <div className="card__top d-flex align-items-center justify-content-between">
            <span className="tour__location d-flex align-items-center gap-1">
              <i className="ri ri-map-pin-line"></i> {city}, {country}
            </span>
            <span className="tour__location d-flex align-items-center gap-1">
              <i className="ri ri-star-fill"></i>{" "}
              {avgRating === 0 ? null : avgRating}
              {totalRating === 0 ? (
                "Not rated"
              ) : (
                <span>({reviews.length})</span>
              )}
            </span>
          </div>

          <h5 className="tour__title">
            <Link to={`/tours/${_id} `}>{title}</Link>
          </h5>

          <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
            <h5>
              ${price} <span> /person</span>
            </h5>
            <Link to={`/tours/${_id} `}>
              <button className="btn booking__btn book__btn__pad btn-primary">
                Book Now
              </button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TourCard;
