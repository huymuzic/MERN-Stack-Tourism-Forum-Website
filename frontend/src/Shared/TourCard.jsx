import Proptypes from "prop-types";
import { Card, CardBody } from "react-bootstrap";
import { Link } from "react-router-dom";
import calculateAvgRating from "../utils/avgRating";
import "./tour-card.css";
import { baseUrl } from "../config/index.js";
import { useTheme } from "../theme/Theme";

const TourCard = ({ tour }) => {
  const { _id, title, country, price, photo, featured, reviews } = tour;
  const { color } = useTheme();
  const { totalRating, avgRating } = calculateAvgRating(reviews);

  return (
    <div className="tour__card">
      <style>
        {`
        .tour__title a {
          color: ${color.textPrimary};
        }
        .tour__title a:hover {
          color: ${color.secondary};
        }
        `}
      </style>
      <Card className="card__tour">
        <div className="tour__img">
          <Link to={`/tours/${_id} `}>
            <img src={`${baseUrl}/api/v1/tours/images/${photo}`} alt={title} />
            {featured && (
              <span tabIndex="0" style={{ backgroundColor: color.primary }}>
                Featured
              </span>
            )}
          </Link>
        </div>

        <CardBody>
          <div className="card__top d-flex align-items-center justify-content-between">
            <span
              tabIndex="0"
              className="tour__location d-flex align-items-center gap-1"
            >
              <i
                className="ri ri-map-pin-line"
                style={{ color: color.secondary }}
              ></i>{" "}
              {country}
            </span>
            <span
              tabIndex="0"
              className="tour__location d-flex align-items-center gap-1"
            >
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

          <div
            className="card__bottom d-flex align-items-center justify-content-between mt-3"
            style={{ color: color.secondary }}
          >
            <h5 tabIndex="0">
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

TourCard.propTypes = {
  tour: Proptypes.object.isRequired,
};

export default TourCard;
