import { useState, useEffect } from "react";
import { pushError } from "../components/Toast";
import { set } from "mongoose";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url);

        if (!res.ok) {
          setError("Failed to fetch data");
          pushError("Failed to fetch data");
        }
        const result = await res.json();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [url]);

  return {
    data,
    error,
  };
};

export default useFetch;
