import { useUser } from "../../utils/UserContext";
import "./index.css";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const Checkout = () => {
  const { user } = useUser();

  return (
    <Container fluid className="checkout-page">
      <Row>
        {/* Left side - Contact Details Form */}
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
                      autoComplete="section-account-details given-name"
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
                      autoComplete="section-account-details family-name"
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
                  value="huyle30072005@gmail.com"
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="numberOfPeople" className="mt-3">
                <Form.Label>Number of People</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter number of people"
                  name="numberOfPeople"
                  autoComplete="section-account-details"
                />
              </Form.Group>
              <Form.Group controlId="specialRequirements" className="mt-3">
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

        {/* Right side - Product Summary */}
        <Col md={5} className="summary-section">
          <div className="container__3K0H">
            <div data-automation="right-hand-rail">
              <div className="container__30uu">
                <div className="headerContainer__3VwO">
                  <img
                    width="48"
                    height="48"
                    alt="Paris Seine River Dinner Cruise with Live Music by Bateaux Mouches"
                    className="image__E6xL"
                    src="https://media.tacdn.com/media/attractions-splice-spp-210x118/11/df/24/bd.jpg"
                  />
                  <div className="titleContainer__1aZq">
                    <span
                      className="title__2N8V title__3Avu title6__3JID"
                      data-automation="right-hand-rail-title"
                    >
                      Paris Seine River Dinner Cruise with Live Music by Bateaux
                      Mouches
                    </span>
                  </div>
                </div>
                <ul className="list__1Hsv">
                  <li className="row__2M1Q">
                    <span>
                      <i className="fa-duotone fa-user-group"></i>
                    </span>
                    <span data-automation="book_details">2 Adults</span>
                  </li>
                  <li className="row__2M1Q">
                    <i className="ri-calendar-line"></i>
                    <span className="date__QZSn book_details">
                      <span data-automation="right-hand-rail-travel-date">
                        Tue, Jun 25, 2024
                      </span>
                      •
                      <span data-automation="right-hand-rail-start-time">
                        7:30 PM
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
                    $365.04
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
  );
};

export default Checkout;
