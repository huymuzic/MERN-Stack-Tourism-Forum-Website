import React, { useState, useRef, useEffect } from "react";
import "./search-bar.css";
import { Col, Form, FormGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { pushError } from "../components/Toast";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  // Form validation
  const countryRef = useRef("");
  const cityRef = useRef("");
  const priceRef = useRef(0);
  const tourPeriodRef = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();

  const [errors, setErrors] = useState({}); // State for validation errors
  const [query, setQuery] = useState({
    country: "",
    price: "",
    tourPeriod: "",
  });

  let countryPattern = /^[a-zA-Z\s\-]+$/;
  let cityPattern = /^[a-zA-Z\s\-]+$/;
  let pricePattern = /^\d{1,4}$/;
  let tourPeriodPattern = /^\d{1,2}$/;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const countryParam = params.get("country") || "";
    const cityParam = params.get("city") || "";
    const priceParam = params.get("price") || "";
    const tourPeriodParam = params.get("duration") || "";

    setQuery({
      country: countryParam,
      city: cityParam,
      price: priceParam,
      tourPeriod: tourPeriodParam,
    });

    countryRef.current.value = countryParam;
    cityRef.current.value = cityParam;
    priceRef.current.value = priceParam;
    tourPeriodRef.current.value = tourPeriodParam;
  }, [location.search]);

  const searchHandler = async (event) => {
    event.preventDefault();
    const country = countryRef.current.value;
    const city = cityRef.current.value;
    const price = priceRef.current.value;
    const tourPeriod = tourPeriodRef.current.value;

    const newErrors = {}; // Object to store validation errors
    const queryParams = [];

    if (country) {
      if (!countryPattern.test(country)) {
        newErrors.country =
          "Please enter a valid country (only characters allowed)";
      } else {
        queryParams.push(`country=${country}`);
      }
    }

    if (city) {
      if (!cityPattern.test(city)) {
        newErrors.city = "Please enter a valid city (only characters allowed)";
      } else {
        queryParams.push(`city=${city}`);
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
        `http://localhost:4000/api/v1/tours/search/getTourBySearch?country=${country}&city=${city}&duration=${tourPeriod}&price=${price}`
      );

      if (!res.ok) {
        pushError("Something went wrong");
      }

      const result = await res.json();

      navigate(
        `/tours/search?country=${country}&city=${city}&duration=${tourPeriod}&price=${price}`,
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
              <h6>Country</h6>
              <input
                type="text"
                placeholder="Where are you going?"
                ref={countryRef}
                defaultValue={query.country}
                aria-describedby="country-error"
              />
              <div id="country-error" className="error-message">
                {errors.country}
              </div>
            </div>
          </FormGroup>
          <FormGroup className="form-group d-flex gap-3 form__group form__group-fast">
            <span>
              <i className="ri ri-building-line"></i>
            </span>
            <div>
              <h6>City</h6>
              <input
                type="text"
                placeholder="Where are you going?"
                ref={cityRef}
                defaultValue={query.city}
                aria-describedby="city-error"
              />
              <div id="city-error" className="error-message">
                {errors.city}
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
                defaultValue={query.price}
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
                defaultValue={query.tourPeriod}
                aria-describedby="tourPeriod-error"
              />
              <div id="tourPeriod-error" className="error-message">
                {errors.tourPeriod}
              </div>
            </div>
          </FormGroup>
          <span className="search__icon" type="submit" onClick={searchHandler}>
            <i className="ri-search-line"></i>
          </span>
        </Form>
      </div>
    </Col>
  );
};

export default SearchBar;
