import { useUser } from "../../utils/UserContext";
import "./index.css";
import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { baseUrl, environment } from "../../config";
import CircularProgress from "../../components/CircularProgress";

const Checkout = () => {
  const { user } = useUser();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (user) {
        try {
          const response = await fetch(
            `${baseUrl}/api/v1/booking/${user._id}`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          if (response.ok) {
            const data = await response.json();
            setBooking(data.booking);
          } else {
            throw new Error("Failed to fetch booking data");
          }
        } catch (error) {
          console.error("Error fetching booking data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBooking();
  }, [user]);

  return (
    <>
      {loading ? (
        <Container className="d-flex justify-content-center">
          <CircularProgress />
        </Container>
      ) : (
        <>
          <Container fluid className="checkout-page">
            <Row>
              <Col md={7} className="form-section">
                <div className="account-details container__WaBz">
                  <h2>Contact Details</h2>
                  <Form>
                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="accountFirstName">
                          <Form.Label>First Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter your first name"
                            name="accountFirstName"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="accountLastName">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter your last name"
                            name="accountLastName"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group controlId="email" className="mt-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        value={booking.email}
                        readOnly
                      />
                    </Form.Group>

                    <Form.Group controlId="numberOfPeople" className="mt-3">
                      <Form.Label>Number of People</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter number of people"
                        name="numberOfPeople"
                        value={booking.numPeople}
                        readOnly
                      />
                    </Form.Group>
                    <Form.Group
                      controlId="specialRequirements"
                      className="mt-3"
                    >
                      <Form.Label>Special requirements</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g wheel chair with nitro turbo"
                        name="specialRequirements"
                        autoComplete="section-account-details"
                      />
                    </Form.Group>
                  </Form>
                </div>
              </Col>

              <Col md={5} className="summary-section">
                <div className="container__3K0H">
                  <div data-automation="right-hand-rail">
                    <div className="container__30uu">
                      <div className="headerContainer__3VwO">
                        <img
                          width="48"
                          height="48"
                          alt={booking.tourTitle}
                          className="image__E6xL"
                          src={
                            environment == "PROD"
                              ? booking.photo
                              : `./src${booking.photo}`
                          }
                        />
                        <div className="titleContainer__1aZq">
                          <span className="title__2N8V title__3Avu title6__3JID">
                            {booking.tourTitle} {booking.city},{" "}
                            {booking.country}
                          </span>
                        </div>
                      </div>
                      <ul className="list__1Hsv">
                        <li className="row__2M1Q">
                          <span>
                            <i className="fa-duotone fa-user-group"></i>
                          </span>
                          <span data-automation="book_details">
                            {booking.numPeople} Adults
                          </span>
                        </li>
                        <li className="row__2M1Q">
                          <i className="ri-calendar-line"></i>
                          <span className="date__QZSn book_details">
                            <span data-automation="right-hand-rail-travel-date">
                              {new Date(booking.date).toDateString()}
                            </span>
                          </span>
                        </li>
                      </ul>
                    </div>
                    <hr className="divider__3jqL" />
                    <div className="total__32Pz">
                      Total price
                      <div className="totalValue__1-Md">
                        <span
                          className="moneyView__3N21 defaultColor__1boI"
                          data-automation="right-hand-rail-total-price"
                        >
                          ${booking.price}
                        </span>
                      </div>
                    </div>
                    <Button variant="primary" className="mt-3 book_btn">
                      Book Now
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </>
      )}
    </>
  );
};

export default Checkout;
