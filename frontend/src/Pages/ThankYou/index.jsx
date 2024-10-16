import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./index.css";

const ThankYou = () => {
  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="pt-5 text-center">
            <div className="thank__you">
              <span>
                <i className="ri-checkbox-circle-line"></i>
              </span>
              <h1 className="mb-3 fw-semibold" tabIndex="0">
                Thank You
              </h1>
              <h3 className="mb-4" tabIndex="0">
                Your tour is booked
              </h3>
              <Link to="/history">
                <Button className="btn primary__btn responsive__btn">
                  Your Purchased History
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ThankYou;
