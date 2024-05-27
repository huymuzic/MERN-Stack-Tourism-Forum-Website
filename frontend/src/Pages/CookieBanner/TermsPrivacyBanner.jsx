import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { useTheme } from "../../theme/Theme";

const TermsPrivacyBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const { themeMode } = useTheme();

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
          <div
            style={{
              ...bannerStyle,
              backgroundColor: themeMode == "light" ? "#fff" : "#111111",
              borderTop:
                themeMode == "light"
                  ? "1px solid #cccccc"
                  : "1px solid #111111",
            }}
          >
            <Container>
              <Row className="align-items-center">
                <Col md={10}>
                  <p
                    className="terms-privacy__p"
                    style={{
                      ...textStyle,
                      color: themeMode == "light" ? "#0b2727" : "#ddd",
                    }}
                  >
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
                    I Understand
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
