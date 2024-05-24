import { useUser } from "../../utils/UserContext";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import CircularProgress from "../../components/CircularProgress";
import BasePaginationList from "../../components/BasePaginationList";
import "./index.css";
import { baseUrl, environment } from "../../config";
import { Link } from "react-router-dom";

const PurchaseHistory = () => {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchBookings = async () => {
    if (user) {
      try {
        const response = await fetch(
          `${baseUrl}/api/v1/booking/user/${user._id}/bookings?page=${page}&limit=10`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setBookings(data.bookings);
          setTotalPages(data.totalPages);
        } else {
          throw new Error("Failed to fetch bookings");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user, page]);

  return (
    <Container className="purchase-history-page">
      {loading ? (
        <CircularProgress />
      ) : (
        <BasePaginationList
          titleTotal="Total bookings"
          totalItems={bookings.length}
          list={bookings}
          totalPages={totalPages}
          renderItem={(item) => (
            <div key={item._id} className="booking-item">
              <div className="booking-details">
                <img
                  src={
                    environment === "PROD" ? item.photo : `./src${item.photo}`
                  }
                  alt={item.tourTitle}
                />
                <div className="details-text">
                  <Link to={`/tours/${item.tourId}`}>
                    <span className="title">
                      <span className="tour__location d-flex align-items-center gap-1">
                        <i className="ri ri-map-pin-line"></i> {item.city},{" "}
                        {item.country}
                      </span>
                      {item.tourTitle}
                    </span>
                  </Link>
                </div>
              </div>
              <ul className="booking-info">
                <li>
                  <i className="ri-calendar-line item_icon"></i>
                  <span>{new Date(item.date).toDateString()}</span>
                </li>
                <li>
                  <i className="fa-duotone fa-user-group item_icon"></i>
                  <span>{item.numPeople} People</span>
                </li>
                <li>
                  <span className="history_price">${item.price}</span>
                </li>
              </ul>
            </div>
          )}
          page={page}
          onChangePage={setPage}
        />
      )}
    </Container>
  );
};

export default PurchaseHistory;
