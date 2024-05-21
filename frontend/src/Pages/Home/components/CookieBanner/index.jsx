import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookie_consent");
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setShowBanner(false);
  };

  return (
    showBanner && (
      <div style={bannerStyle}>
        <Container>
          <Row className="align-items-center">
            <Col md={10}>
              <p className="cookie__p" style={textStyle}>
                Our website uses cookies for authentication and to improve your
                experience. By using our website, you consent to our use of
                cookies.
              </p>
            </Col>
            <Col md={2} className="text-right cookie__btn__container">
              <Button
                className="normal__pad accept__btn"
                onClick={handleAccept}
              >
                Accept
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    )
  );
};

const bannerStyle = {
  position: "fixed",
  bottom: 0,
  width: "100%",
  backgroundColor: "#ffffff",
  borderTop: "1px solid #cccccc",
  padding: "10px 0",
  zIndex: 10000,
};

const textStyle = {
  margin: 0,
  fontSize: "1rem",
  color: "var(--heading-color)",
};

export default CookieBanner;
