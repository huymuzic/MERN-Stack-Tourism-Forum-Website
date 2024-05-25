import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { pushError, pushSuccess } from "../../components/Toast";
import CircularProgress from "../../components/CircularProgress";
import { baseUrl, environment } from "../../config";
import "./index.css";
import { useTheme } from "../../theme/Theme";

const Checkout = () => {
  const { color, themeMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const bookingDetails = location.state?.bookingDetails;

  if (!bookingDetails) {
    return (
      <Container className="d-flex justify-content-center">
        <CircularProgress />
      </Container>
    );
  }

  const handleFinalBooking = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/v1/booking/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bookingDetails),
      });

      const responseBody = await response.json();
      if (response.ok) {
        let msg = responseBody.message;
        navigate("/thank-you");
        setTimeout(() => {
          pushSuccess(msg);
        }, 500);
      } else {
        throw new Error(responseBody.message);
      }
    } catch (error) {
      pushError("Something went wrong while booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Container className="d-flex justify-content-center">
          <CircularProgress />
        </Container>
      ) : (
        <Container fluid className="checkout-page">
          <Row>
            <Col
              md={7}
              className="form-section"
              style={{
                backgroundColor: themeMode == "light" ? "#f5f5f5" : "#333333",
              }}
            >
              <div
                className="account-details"
                style={{
                  backgroundColor: themeMode == "light" ? "#f5f5f5" : "#212529",
                }}
              >
                <h2>Contact Details</h2>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your first name"
                          name="accountFirstName"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your last name"
                          name="accountLastName"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mt-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      name="email"
                      value={bookingDetails.email}
                      readOnly
                    />
                  </Form.Group>

                  <Form.Group className="mt-3">
                    <Form.Label>Number of People</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter number of people"
                      name="numberOfPeople"
                      value={bookingDetails.numPeople}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <Form.Label>Special requirements</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g wheel chair with nitro turbo"
                      name="specialRequirements"
                    />
                  </Form.Group>
                </Form>
              </div>
            </Col>

            <Col
              md={5}
              className="summary-section"
              style={{
                backgroundColor: themeMode == "light" ? "#f5f5f5" : "#333333",
              }}
            >
              <div
                className="checkout__container_1"
                style={{
                  backgroundColor: themeMode == "light" ? "#f5f5f5" : "#212529",
                }}
              >
                <div>
                  <div className="checkout__container_2">
                    <div className="header__container">
                      <img
                        width="60"
                        height="60"
                        alt={bookingDetails.tourTitle}
                        className="image__E6xL"
                        src={
                          environment == "PROD"
                            ? bookingDetails.photo
                            : `./src${bookingDetails.photo}`
                        }
                      />
                      <div className="title__container">
                        <span className="title_1">
                          {bookingDetails.tourTitle} {bookingDetails.city},{" "}
                          {bookingDetails.country}
                        </span>
                        <span className="title_1 tour_price">
                          ${bookingDetails.tourPrice}
                        </span>
                      </div>
                    </div>
                    <ul className="list__1">
                      <li className="row__1">
                        <span>
                          <i className="fa-duotone fa-user-group item_icon"></i>
                        </span>
                        <span className="book__details">
                          {bookingDetails.numPeople} Adults
                        </span>
                      </li>
                      <li className="row__1">
                        <i className="ri-calendar-line item_icon"></i>
                        <span className="book__details checkout_date">
                          <span>
                            {new Date(bookingDetails.date).toDateString()}
                          </span>
                        </span>
                      </li>
                    </ul>
                  </div>
                  <hr className="checkout_hr" />
                  <div className="total__price">
                    Total price
                    <div className="total__value">
                      <span className="moneyView__3N21 defaultColor__1boI">
                        ${bookingDetails.price}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    className="mt-3 book_btn"
                    onClick={handleFinalBooking}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default Checkout;
