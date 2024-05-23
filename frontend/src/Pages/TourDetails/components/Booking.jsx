import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { pushError, pushSuccess } from "../../../components/Toast";
import { useUser } from "../../../utils/UserContext";
import "./booking.css";
import { baseUrl } from "../../../config";

import {
  Form,
  FormGroup,
  ListGroup,
  ListGroupItem,
  Button,
} from "react-bootstrap";

const Booking = ({ tour, avgRating }) => {
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

  const incrementPeople = () => {
    setNumPeople((prevNumPeople) => Math.min(prevNumPeople + 1, 10));
  };

  const decrementPeople = () => {
    setNumPeople((prevNumPeople) => Math.max(prevNumPeople - 1, 1));
  };

  const handleBookFormSubmit = async (e) => {
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

    try {
      const response = await fetch(`${baseUrl}/api/v1/booking/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId: user._id,
          email: user.email,
          tourId: tour._id,
          tourTitle: title,
          country: tour.country,
          city: tour.city,
          photo: tour.photo,
          date: bookTime,
          price: totalPrice,
          numPeople,
        }),
      });
      const responseBody = await response.json();
      if (response.ok) {
        pushSuccess(responseBody.message);
        navigate("/checkout");
      } else {
        throw new Error(responseBody.message);
      }
    } catch (error) {
      pushError("Something went wrong while booking");
    }
  };

  return (
    <div className="booking">
      <div className="booking__top d-flex align-items-center justify-content-between">
        <h3>
          ${price} <span>/ adult</span>
        </h3>
        <span className="tour__rating d-flex align-items-center">
          <i className="ri ri-star-s-fill"></i>
          {avgRating === 0 ? null : avgRating} ({reviews?.length})
        </span>
      </div>

      <div className="booking__form">
        <h5>Information</h5>
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
              >
                -
              </button>
              <button className="guests__container">
                <span
                  className="numberOfGuests"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {peopleValue}
                </span>
              </button>
              <button
                className="guests__container"
                type="button"
                onClick={incrementPeople}
                aria-label="Increase number of guests"
              >
                +
              </button>
            </span>
          </div>
          <FormGroup className="d-flex align-items-center gap-3">
            <input type="date" placeholder="" id="bookTime" />
          </FormGroup>
        </Form>
      </div>

      <div className="booking__bottom">
        <ListGroup>
          <ListGroupItem className="border-0 px-0 book_form_row">
            <h5 className="d-flex align-items-center gap-1">
              ${price} <i className="ri-close-line"></i> {numPeople} person(s)
            </h5>
            <span> ${price * numPeople}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0 book_form_row">
            <h5>Service charge</h5>
            <span> ${10 * numPeople}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0 total book_form_row">
            <h5>Total</h5>
            <span> ${totalPrice}</span>
          </ListGroupItem>
        </ListGroup>

        <Button
          variant="primary"
          className="btn primary__btn w-100 mt-4 book__btn normal__pad"
          onClick={handleBookFormSubmit}
        >
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default Booking;
