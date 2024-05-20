import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pushError } from "../components/Toast";
import { baseUrl } from "../config";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const navigate = useNavigate();

  const searchHandler = async (searchParams) => {
    const { country, city, price, tourPeriod } = searchParams;
    const newErrors = {};
    const queryParams = [];

    if (country && !/^[a-zA-Z\s\-]+$/.test(country)) {
      newErrors.country =
        "Please enter a valid country ( only characters allowed )";
      pushError(newErrors.country);
    } else if (country) {
      queryParams.push(`country=${country}`);
    }

    if (city && !/^[a-zA-Z\s\-]+$/.test(city)) {
      newErrors.city = "Please enter a valid city ( only characters allowed )";
      pushError(newErrors.city);
    } else if (city) {
      queryParams.push(`city=${city}`);
    }

    if (price && !/^\d{1,4}$/.test(price)) {
      newErrors.price = "Please enter a valid price ( max 4 numbers )";
      pushError(newErrors.price);
    } else if (price) {
      queryParams.push(`price=${price}`);
    }

    if (tourPeriod && !/^\d{1,2}$/.test(tourPeriod)) {
      newErrors.tourPeriod =
        "Please enter a valid tour period ( max 2 numbers )";
      pushError(newErrors.tourPeriod);
    } else if (tourPeriod) {
      queryParams.push(`duration=${tourPeriod}`);
    }

    if (Object.keys(newErrors).length === 0 && queryParams.length > 0) {
      try {
        const res = await fetch(
          `${baseUrl}/api/v1/tours/search/getTourBySearch?${queryParams.join(
            "&"
          )}`
        );

        if (!res.ok) {
          throw new Error("Something went wrong");
        }

        const result = await res.json();
        navigate(`/tours/search?${queryParams.join("&")}`, {
          state: result.data,
        });
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  return (
    <SearchContext.Provider value={{ searchHandler }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
