import { useEffect, useState } from "react";
import "./index.css";

import {
  Link as ScrollLink,
  Element,
  animateScroll as scroll,
} from "react-scroll";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import { EffectFade, Keyboard, Autoplay } from "swiper/modules";

import Subtitle from "./components/Subtitle/Subtitle";
import ServiceList from "./components/ServiceList/ServiceList";
import DestinationList from "./components/Destinations/DestinationList";
import FeaturedTourList from "./components/FeaturedTours/FeaturedTourList";
import ContactModal from "./components/Contact/ContactModal";
import CircularProgress from "../../components/CircularProgress";
import { baseUrl, environment } from "../../config";

const Home = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const response = await fetch(`${baseUrl}/api/v1/images/`);
    const Images = await response.json();
    if (Images && Images.data) {
      if (environment == "PROD") {
        setHeroImages(
          Images.data.filter((item) => item.title !== "Common Section Image")
        );
      } else {
        console.log("🚀 ~ fetchData ~ Images:", Images);

        setHeroImages(
          Images.data
            .filter((item) => item.title !== "Common Section Image")
            .map((item) => {
              return {
                ...item,
                photo: `./src${item.photo}`,
              };
            })
        );
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    scroll.scrollToTop();
  }, []);

  return (
    <>
      {/* Hero Section Starts */}
      <Element name="section1">
        <Container className="hero__container">
          <Swiper
            spaceBetween={30}
            effect={"fade"}
            centeredSlides={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            keyboard={{
              enabled: true,
            }}
            navigation={true}
            modules={[EffectFade, Keyboard, Autoplay]}
            className="mySwiper home__swiper"
          >
            {heroImages.map((image, index) => (
              <SwiperSlide key={index}>
                <Container className="custom__container">
                  {isLoading ? (
                    <CircularProgress />
                  ) : (
                    <>
                      <div className="hero__slide p-5">
                        <h1>Join the conversation with</h1>
                        <h1>
                          <span className="highlight">travelers</span> around
                          the world today
                        </h1>
                        <p className="homepage__p">
                          Dive into a world of discovery with our curated
                          selection of tours designed to immerse you in the
                          beauty of each destination
                        </p>
                        <Link to="/forum">
                          <Button className="primary__btn big__pad btn-primary join__now">
                            JOIN NOW
                          </Button>
                        </Link>
                      </div>
                      <div className="swiper__slide__image">
                        <img src={image.photo} alt={image.title} />
                      </div>
                    </>
                  )}
                </Container>
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </Element>
      {/* Hero Section Ends */}

      {/*SERVICES SECTION STARTS */}
      <section>
        <Container>
          <Row>
            <Col lg="3">
              <h5 className="services__subtitle">What we serve</h5>
              <h2 className="services__title">We offer our best services</h2>
            </Col>
            <ServiceList />
          </Row>
        </Container>
      </section>
      {/* SERVICES SECTION ENDS */}

      {/* FEATURED TOUR SECTION STARTS*/}
      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5">
              <Subtitle subtitle={"Explore"} />
              <h2 className="featured__tour-title l2">Our featured tours</h2>
            </Col>
            <FeaturedTourList />
          </Row>
        </Container>
      </section>
      {/* FEATURED TOUR SECTION ENDS*/}

      {/* TOUR DESTINATIONS SECTION STARTS */}
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <div className="d-flex align-items-center justify-content-center">
                <h2 className="l2">Top Destinations</h2>
              </div>
            </Col>
            <div className="container image-container">
              <DestinationList />
            </div>
          </Row>
        </Container>
      </section>
      {/* TOUR DESTINATIONS SECTION ENDS */}
      <ContactModal />
      {/* Links to sections */}
      <ScrollLink to="section1" smooth={true} duration={500}></ScrollLink>
    </>
  );
};

export default Home;
