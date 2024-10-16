import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { pushError } from "../../../components/Toast";
import { useUser } from "../../../utils/UserContext";
import "./booking.css";
import {
  Form,
  FormGroup,
  ListGroup,
  ListGroupItem,
  Button,
} from "react-bootstrap";
import { useTheme } from "../../../theme/Theme";

const Booking = ({ tour, avgRating }) => {
  const { color, themeMode } = useTheme();
  const navigate = useNavigate();
  const { user } = useUser();
  const [numPeople, setNumPeople] = useState(1);
  const { price, reviews, title } = tour;
  const [peopleValue, setPeopleValue] = useState("01");
  const [totalPrice, setTotalPrice] = useState(price);

  useEffect(() => {
    setPeopleValue(numPeople < 10 ? `0${numPeople}` : numPeople.toString());
    setTotalPrice(price * numPeople + 10 * numPeople);
  }, [numPeople, price]);

  const incrementPeople = (e) => {
    e.preventDefault();
    setNumPeople((prevNumPeople) => Math.min(prevNumPeople + 1, 100));
  };

  const decrementPeople = (e) => {
    e.preventDefault();
    setNumPeople((prevNumPeople) => Math.max(prevNumPeople - 1, 1));
  };

  const preventDefaultSpanClick = (e) => {
    e.preventDefault();
  };

  const handleBookFormSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      pushError("Please login to book a tour");
      return;
    }

    const bookTime = document.getElementById("bookTime").value;

    if (bookTime.trim() === "") {
      pushError("Please choose a date");
      return;
    }

    const bookingDetails = {
      userId: user._id,
      email: user.email,
      tourId: tour._id,
      tourTitle: title,
      country: tour.country,
      city: tour.city,
      photo: tour.photo,
      tourPrice: tour.price,
      date: bookTime,
      price: totalPrice,
      numPeople,
    };

    navigate("/checkout", { state: { bookingDetails } });
  };

  return (
    <div
      className="booking"
      style={{
        border: themeMode == "light" ? "" : "1px solid #ddd",
      }}
    >
      <div className="booking__top d-flex align-items-center justify-content-between">
        <h3 tabIndex="0">
          ${price} <span>/ adult</span>
        </h3>
        <span
          tabIndex="0"
          className="tour__rating d-flex align-items-center"
          style={{
            color: themeMode == "light" ? "#0b2727" : "#fff",
          }}
        >
          <i className="ri ri-star-s-fill"></i>
          {avgRating === 0 ? null : avgRating} ({reviews?.length})
        </span>
      </div>

      <div className="booking__form">
        <h5 tabIndex="0">Information</h5>
        <Form className="booking_info-form d-flex flex-column justify-content-center align-items-flex-start p-3 gap-3">
          <div className="booking_first_container">
            <span tabIndex="0">People</span>
            <span>
              <i className="fa-duotone fa-user-group"></i>
            </span>
            <span className="wrapper">
              <button
                className="guests__container"
                type="button"
                onClick={decrementPeople}
                aria-label="Decrease number of guests"
                style={{
                  backgroundColor: themeMode == "light" ? "#fff" : "#ddd",
                }}
              >
                -
              </button>
              <button
                className="guests__container"
                style={{
                  backgroundColor: themeMode == "light" ? "#fff" : "#ddd",
                  cursor: "default",
                }}
                onClick={preventDefaultSpanClick}
              >
                <span
                  className="numberOfGuests"
                  aria-live="polite"
                  aria-atomic="true"
                  style={{
                    backgroundColor: themeMode == "light" ? "#fff" : "#ddd",
                  }}
                >
                  {peopleValue}
                </span>
              </button>
              <button
                className="guests__container"
                type="button"
                onClick={incrementPeople}
                aria-label="Increase number of guests"
                style={{
                  backgroundColor: themeMode == "light" ? "#fff" : "#ddd",
                }}
              >
                +
              </button>
            </span>
          </div>
          <FormGroup className="d-flex align-items-center gap-3">
            <input
              type="date"
              placeholder=""
              id="bookTime"
              style={{ color: color.textPrimary }}
              tabIndex="0"
            />
          </FormGroup>
        </Form>
      </div>

      <div className="booking__bottom">
        <ListGroup>
          <ListGroupItem className="border-0 px-0 book_form_row">
            <h5 tabIndex="0" className="d-flex align-items-center gap-1">
              ${price} <i className="ri-close-line"></i> {numPeople} person(s)
            </h5>
            <span tabIndex="0"> ${price * numPeople}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0 book_form_row">
            <h5 tabIndex="0">Service charge</h5>
            <span tabIndex="0"> ${10 * numPeople}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0 total book_form_row">
            <h5 tabIndex="0">Total</h5>
            <span tabIndex="0"> ${totalPrice}</span>
          </ListGroupItem>
        </ListGroup>

        <Button
          variant="primary"
          className="btn primary__btn w-100 mt-4 book__btn normal__pad"
          onClick={handleBookFormSubmit}
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};

Booking.propTypes = {
  tour: PropTypes.shape({
    price: PropTypes.number.isRequired,
    reviews: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
  }).isRequired,
  avgRating: PropTypes.number.isRequired,
};

export default Booking;
