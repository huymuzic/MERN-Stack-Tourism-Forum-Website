import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const TermsPrivacyBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const termsPrivacyConsent = localStorage.getItem("terms_privacy_consent");
    if (!termsPrivacyConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("terms_privacy_consent", "accepted");
    setShowBanner(false);
  };

  return (
    <>
      {showBanner && (
        <>
          <div style={bannerStyle}>
            <Container>
              <Row className="align-items-center">
                <Col md={10}>
                  <p className="terms-privacy__p" style={textStyle}>
                    By using our website, you agree to our{" "}
                    <Link
                      to="/terms-of-service"
                      target="_blank"
                      style={linkStyle}
                    >
                      Terms of Service
                    </Link>
                    ,{" "}
                    <Link
                      to="/privacy-policy"
                      target="_blank"
                      style={linkStyle}
                    >
                      Privacy Policy{" "}
                    </Link>
                    and the storing of cookies on your device.
                  </p>
                </Col>
                <Col
                  md={2}
                  className="text-right terms-privacy__btn__container"
                >
                  <Button
                    className="normal__pad accept__btn"
                    onClick={handleAccept}
                  >
                    I Accept
                  </Button>
                </Col>
              </Row>
            </Container>
          </div>
        </>
      )}
    </>
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
  color: "var(--heading-color)",
};

const linkStyle = {
  color: "var(--primary-color)",
  textDecoration: "underline",
};

export default TermsPrivacyBanner;
