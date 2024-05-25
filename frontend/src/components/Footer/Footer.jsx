import "./footer.css";
import { useEffect, useState } from "react";
import { baseUrl, environment } from "../../config/index.js";
import { Container, Row, Col, ListGroup, ListGroupItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTheme } from "../../theme/Theme";
import CircularProgress from "../CircularProgress.jsx";

const quick__links = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/forum",
    display: "Forum",
  },
  {
    path: "/tours",
    display: "Tours",
  },
];

const quick__links2 = [
  {
    path: "login",
    display: "Login",
  },
  {
    path: "/register",
    display: "Register",
  },
  {
    path: "/Sitemap",
    display: "Sitemap",
  },
];

const Footer = () => {
  const { color } = useTheme();
  const [logoImage, setLogoImage] = useState();
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const response = await fetch(`${baseUrl}/api/v1/images/`);
    const Image = await response.json();
    if (Image && Image.data) {
      if (environment == "PROD") {
        setLogoImage(Image.data.filter((item) => item.title == "Logo image"));
      } else {
        setLogoImage(
          Image.data
            .filter((item) => item.title == "Logo image")
            .map((item) => {
              return {
                ...item,
                photo: `./src${item.photo}`,
              };
            })
        );
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      {loading ? (
        <Container className="d-flex justify-content-center">
          <CircularProgress />
        </Container>
      ) : (
        <>
          <footer className="footer">
            <Container>
              <Row>
                <Col lg="3" className="logo-container">
                  <div className="logo">
                    <Link to="/">
                      <img src={logoImage[0].photo} alt="footer-logo" />
                    </Link>
                  </div>
                </Col>
                <Col lg="3">
                  <h5 className="footer__link-title l5">Discover</h5>
                  <ListGroup className="footer__quick-links">
                    {quick__links.map((item, index) => (
                      <ListGroupItem key={index} className="ps-0 border-0">
                        <Link
                          to={item.path}
                          style={{ color: color.textPrimary }}
                        >
                          {item.display}
                        </Link>
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                </Col>
                <Col lg="3">
                  <h5 className="footer__link-title l5">Quick Links</h5>
                  <ListGroup className="footer__quick-links">
                    {quick__links2.map((item, index) => (
                      <ListGroupItem key={index} className="ps-0 border-0">
                        <Link
                          to={item.path}
                          style={{ color: color.textPrimary }}
                        >
                          {item.display}
                        </Link>
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                </Col>
                <Col lg="3">
                  <h5 className="footer__link-title l5">Contact</h5>
                  <ListGroup className="footer__quick-links">
                    <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-3">
                      <h6 className="mb-0 d-flex align-items-center gap-2 l6">
                        <span>
                          <i className="ri-map-pin-line"></i>
                        </span>
                        Location:
                      </h6>
                      <Link to="https://www.google.com/maps/place/%C4%90%E1%BA%A1i+H%E1%BB%8Dc+RMIT+Nam+S%C3%A0i+G%C3%B2n/@10.7291554,106.693238,17z/data=!3m1!4b1!4m6!3m5!1s0x31752fbea5fe3db1:0xfae94aca5709003f!8m2!3d10.7291501!4d106.6958129!16s%2Fm%2F04g0808?hl=vi-VN&entry=ttu">
                        <p className="mb-2 location_footer">
                          RMIT University Vietnam
                        </p>
                      </Link>
                    </ListGroupItem>
                    <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-3">
                      <h6 className="mb-0 d-flex align-items-center gap-2 l6">
                        <span>
                          <i className="ri-mail-line"></i>
                        </span>
                        Email:
                      </h6>
                      <p className="mb-2">cosmictravel123@gmail.com</p>
                    </ListGroupItem>
                    <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-3">
                      <h6 className="mb-0 d-flex align-items-center gap-2 l6">
                        <span>
                          <i className="ri-phone-fill"></i>
                        </span>
                        Phone:
                      </h6>

                      <p className="mb-2">+(84) 123 456 789</p>
                    </ListGroupItem>
                  </ListGroup>
                </Col>
              </Row>
            </Container>
          </footer>
          <br></br>
          <hr className="col-10 mx-auto custom-hr"></hr>

          <div className="col-10 mx-auto">
            <ul className="list-unstyled d-flex flex-row gap-3 justify-content-evenly">
              <li>&copy; 2024 Cosmic Travel</li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="custom-anchor"
                  style={{ color: color.textPrimary }}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="custom-anchor"
                  style={{ color: color.textPrimary }}
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default Footer;
