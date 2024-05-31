import { useUser } from "../../utils/UserContext";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import CircularProgress from "../../components/CircularProgress";
import BasePaginationList from "../../components/BasePaginationList";
import "./index.css";
import { baseUrl } from "../../config";
import { Link } from "react-router-dom";
import { useTheme } from "../../theme/Theme";

const PurchaseHistory = () => {
  const { user } = useUser();
  const { themeMode } = useTheme();
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
    <Container
      fluid="md"
      className="purchase-history-page"
      style={{
        backgroundColor: themeMode == "light" ? "#f5f5f5" : "#212529",
      }}
    >
      {loading ? (
        <Container className="d-flex justify-content-center">
          <CircularProgress />
        </Container>
      ) : bookings.length === 0 ? (
        <Container className="d-flex justify-content-center">
          <h5
            tabIndex="0"
            style={{ color: themeMode == "light" ? "#000" : "#fff" }}
          >
            You have not purchased any tour
          </h5>
        </Container>
      ) : (
        <BasePaginationList
          titleTotal="Total bookings"
          totalItems={bookings.length}
          list={bookings}
          totalPages={totalPages}
          renderItem={(item) => (
            <div
              key={item._id}
              className="booking-item"
              style={{
                backgroundColor: themeMode == "light" ? "#fff" : "#212529",
              }}
            >
              <div className="booking-details">
                <img
                  tabIndex="0"
                  src={`${baseUrl}/api/v1/tours/images/${item.photo}`}
                  alt={item.tourTitle}
                />
                <div className="details-text">
                  <Link to={`/tours/${item.tourId}`}>
                    <span
                      tabIndex="0"
                      className="title"
                      style={{
                        color: themeMode == "light" ? "#444444" : "#fff",
                      }}
                    >
                      <span
                        tabIndex="0"
                        className="tour__location d-flex align-items-center gap-1"
                      >
                        <i
                          className="ri ri-map-pin-line"
                          style={{
                            color: themeMode == "light" ? "#faa935" : "#fff",
                          }}
                        ></i>{" "}
                        {item.city}, {item.country}
                      </span>
                      {item.tourTitle}
                    </span>
                  </Link>
                </div>
              </div>
              <ul
                className="booking-info"
                style={{
                  color: themeMode == "light" ? "#000000" : "#fff",
                }}
              >
                <li>
                  <i className="ri-calendar-line item_icon"></i>
                  <span tabIndex="0">{new Date(item.date).toDateString()}</span>
                </li>
                <li>
                  <i className="fa-duotone fa-user-group item_icon"></i>
                  <span tabIndex="0">{item.numPeople} People</span>
                </li>
                <li>
                  <span tabIndex="0" className="history_price">
                    ${item.price}
                  </span>
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
