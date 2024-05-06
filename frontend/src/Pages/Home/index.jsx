import React from 'react'
import './index.css'

import { Container, Row, Col, Button } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import heroImage1 from '../../assets/images/hero-image-1.jpg';
import heroImage2 from '../../assets/images/hero-image-2.jpg';
import heroImage3 from '../../assets/images/hero-image-3.jpg';
import heroImage4 from '../../assets/images/hero-image-4.jpg';

import { EffectFade, Keyboard, Autoplay, Pagination } from 'swiper/modules';

import Subtitle from './components/Subtitle/Subtitle'
import ServiceList from './components/ServiceList/ServiceList';
import DestinationList from './components/Destinations/DestinationList';
import FeaturedTourList from './components/FeaturedTours/FeaturedTourList';
import ContactModal from './components/Contact/ContactModal'

const heroImages = [heroImage2, heroImage1, heroImage3, heroImage4];

const Home = () => {

    return <>
    
    {/* Hero Section Starts */}
        <Container className='hero-container'>
            <Swiper
                spaceBetween={30}
                effect={'fade'}
                centeredSlides={true}
                autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            keyboard={{
            enabled: true,
            }}            
            pagination={{
            clickable: true,
            }}
            navigation={true}
            modules={[EffectFade, Keyboard, Autoplay, Pagination]}
            className="mySwiper"
            >
            {heroImages.map((image, index) => (
              <SwiperSlide key={index}>
                <Container className="custom__container">
                  <div className="hero__slide">
                    <h1>Join the conversation with</h1>
                    <h1>
                      <span className="highlight">travelers</span> around the world
                      today
                    </h1>
                    <p>
                      Dive into a world of discovery with our curated selection
                      of tours designed to immerse you in the beauty of each
                      destination
                    </p>
                    <Button className="primary__btn"><Link to='/forum'>JOIN NOW</Link></Button>
                  </div>
                  <img src={image} alt="" />
                </Container>
              </SwiperSlide>
            ))}
            </Swiper>            
        </Container>
    {/* Hero Section Ends */}
    
    {/*SERVICES SECTION STARTS */}
    <section id = "a">
        <Container>
            <Row>
                <Col lg='3'>
                    <h5 className="services__subtitle">What we serve</h5>
                    <h2 className= "services__title">We offer our best services</h2>
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
                <Col lg='12' className='mb-5'>
                    <Subtitle subtitle={'Explore'} />
                    <h2 className='featured__tour-title'>Our featured tours</h2>
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
                <Col lg='12'>
                    <div className='d-flex align-items-center justify-content-center'><h2>Top Destinations</h2></div>
                </Col>    
                <div className='container image-container'>            
                <DestinationList /> 
                </div>
            </Row>   
        </Container>    
    </section>
    {/* TOUR DESTINATIONS SECTION ENDS */}
    <ContactModal />
    </>
};

export default Home;