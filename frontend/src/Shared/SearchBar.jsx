import { useState, useRef, useEffect } from "react";
import "./search-bar.css";
import { Col, Form, FormGroup } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useSearch } from "../utils/SearchContext";
import { useTheme } from "../theme/Theme";
const SearchBar = () => {
  const { color } = useTheme();
  const countryRef = useRef("");
  const cityRef = useRef("");
  const priceRef = useRef(0);
  const tourPeriodRef = useRef(0);
  const location = useLocation();
  const { searchHandler } = useSearch();
  const [errors] = useState({});
  const [query, setQuery] = useState({
    country: "",
    city: "",
    price: "",
    tourPeriod: "",
  });

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

  const handleSearch = async (event) => {
    event.preventDefault(event);
    const country = countryRef.current.value;
    const city = cityRef.current.value;
    const price = priceRef.current.value;
    const tourPeriod = tourPeriodRef.current.value;

    const searchParams = { country, city, price, tourPeriod };
    searchHandler(searchParams);
  };

  const handleEnter = (event) => {
    event.preventDefault();
    if (event.key === "Enter") {
      handleSearch(event);
    }
  };

  return (
    <Col lg="12">
      <div className="search__bar">
        <Form className="d-flex align-items-center gap-4">
          <FormGroup
            className="form-group d-flex gap-3 form__group form__group-fast"
            onClick={() => countryRef.current.focus()}
          >
            <span>
              <i
                className="search__bar__icon ri-map-pin-line"
                style={{ color: color.secondary }}
              ></i>
            </span>
            <div className="search_bar_input">
              <h6 tabIndex="0" className="l6">
                Country
              </h6>
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
          <FormGroup
            className="form-group d-flex gap-3 form__group form__group-fast"
            onClick={() => cityRef.current.focus()}
          >
            <span>
              <i
                className="search__bar__icon ri-building-line"
                style={{ color: color.secondary }}
              ></i>
            </span>
            <div>
              <h6 tabIndex="0" className="l6">
                City
              </h6>
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
          <FormGroup
            className="form-group d-flex gap-3 form__group form__group-fast"
            onClick={() => priceRef.current.focus()}
          >
            <span>
              <i
                className="search__bar__icon ri-money-dollar-circle-line"
                style={{ color: color.secondary }}
              ></i>
            </span>
            <div>
              <h6 tabIndex="0" className="l6">
                Price
              </h6>
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
          <FormGroup
            className="form-group d-flex gap-3 form__group form__group-last"
            onClick={() => tourPeriodRef.current.focus()}
          >
            <span>
              <i
                className="search__bar__icon ri-map-pin-time-line"
                style={{ color: color.secondary }}
              ></i>
            </span>
            <div>
              <h6 tabIndex="0" className="l6">
                Duration
              </h6>
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
          <span
            className="search__icon"
            type="submit"
            onClick={handleSearch}
            onKeyDown={handleEnter}
            tabIndex="0"
          >
            <i className="ri-search-line"></i>
          </span>
        </Form>
      </div>
    </Col>
  );
};

export default SearchBar;
