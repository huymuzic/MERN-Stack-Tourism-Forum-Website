import React, { useState, useRef } from "react";
import "./search-bar.css";
import { Col, Form, FormGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { pushError } from "../components/Toast";

const SearchBar = () => {
  // Form validation
  const locationRef = useRef("");
  const priceRef = useRef(0);
  const tourPeriodRef = useRef(0);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({}); // State for validation errors

  let locationPattern = /^[a-zA-Z\s\-]+$/;
  let pricePattern = /^\d{1,4}$/;
  let tourPeriodPattern = /^\d{1,2}$/;

  const searchHandler = async (event) => {
    event.preventDefault();
    const location = locationRef.current.value;
    const price = priceRef.current.value;
    const tourPeriod = tourPeriodRef.current.value;

    const newErrors = {}; // Object to store validation errors
    const queryParams = [];

    if (location) {
      if (!locationPattern.test(location)) {
        newErrors.location =
          "Please enter a valid location (only characters allowed)";
      } else {
        queryParams.push(`country=${location}`);
      }
    }

    if (price) {
      if (!pricePattern.test(price)) {
        newErrors.price = "Please enter a valid price (max 4 numbers)";
      } else {
        queryParams.push(`price=${price}`);
      }
    }

    if (tourPeriod) {
      if (!tourPeriodPattern.test(tourPeriod)) {
        newErrors.tourPeriod =
          "Please enter a valid tour period (max 2 numbers)";
      } else {
        queryParams.push(`duration=${tourPeriod}`);
      }
    }

    setErrors(newErrors); // Update errors state

    if (Object.keys(newErrors).length === 0 && queryParams.length > 0) {
      const res = await fetch(
        `http://localhost:4000/api/v1/tours/search/getTourBySearch?country=${location}&duration=${tourPeriod}&price=${price}`
      );

      if (!res.ok) {
        pushError("Something went wrong");
      }

      const result = await res.json();

      navigate(
        `/tours/search?country=${location}&duration=${tourPeriod}&price=${price}`,
        { state: result.data }
      );
    }
  };

  return (
    <Col lg="12">
      <div className="search__bar">
        <Form className="d-flex align-items-center gap-4">
          <FormGroup className="form-group d-flex gap-3 form__group form__group-fast">
            <span>
              <i className="ri ri-map-pin-line"></i>
            </span>
            <div>
              <h6>Location (country)</h6>
              <input
                type="text"
                placeholder="Where are you going?"
                ref={locationRef}
                aria-describedby="location-error"
              />
              <div id="location-error" className="error-message">
                {errors.location}
              </div>
            </div>
          </FormGroup>
          <FormGroup className="form-group d-flex gap-3 form__group form__group-fast">
            <span>
              <i className="ri ri-money-dollar-circle-line"></i>
            </span>
            <div>
              <h6>Price</h6>
              <input
                id="price"
                type="number"
                placeholder="Enter a number"
                ref={priceRef}
                aria-describedby="price-error"
              />
              <div id="price-error" className="error-message">
                {errors.price}
              </div>
            </div>
          </FormGroup>
          <FormGroup className="form-group d-flex gap-3 form__group form__group-last">
            <span>
              <i className="ri ri-map-pin-time-line"></i>
            </span>
            <div>
              <h6>Duration</h6>
              <input
                id="tourPeriod"
                type="number"
                placeholder="day(s)"
                ref={tourPeriodRef}
                aria-describedby="tourPeriod-error"
              />
              <div id="tourPeriod-error" className="error-message">
                {errors.tourPeriod}
              </div>
            </div>
          </FormGroup>
          <span className="search__icon" type="submit"  tabindex="0" onClick={searchHandler}>
            <i className="ri-search-line"></i>
          </span>
        </Form>
      </div>
    </Col>
  );
};

export default SearchBar;
