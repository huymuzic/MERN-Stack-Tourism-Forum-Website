import React from 'react'
import './footer.css'
import instaLogo from '../../assets/images/instagram.svg'
import tiktokLogo from '../../assets/images/tiktok.svg'
import facebookLogo from '../../assets/images/facebook.svg'

import { Container, Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const quick__links = [
    {
        path:'/home',
        display:'Home'
    },
    {
        path:'/forum',
        display:'Forum'
    },
    {
        path:'/tours',
        display:'Tours'
    }
]

const quick__links2 = [
    {
        path:'/gallery',
        display:'Gallery'
    },
    {
        path:'/Login',
        display:'Login'
    },
    {
        path:'/register',
        display:'Register'
    }
]

const Footer = () => {
    return <>
    <footer className='footer'>
        <Container>
            <Row>
                <Col lg='3' className='logo-container'>
                    <div className='logo'>
                        <img src ={logo} alt='footer-logo' /> 
                        <div className="social__links d-flex align-items-center">
                        <span>
                            <Link to='#'><img className='icon' src={instaLogo} alt='' /></Link>
                        </span>
                        <span>
                            <Link to='#'><img className='icon' src={facebookLogo} alt ='' /></Link>
                        </span>
                        <span>
                            <Link to='#'><img className='icon' src={tiktokLogo} alt ='' /></Link>      
                        </span>                   
                        </div>
                    </div>
                </Col>
                <Col lg='3'>
                    <h5 className='footer__link-title'>Discover</h5>
                    <ListGroup className='footer__quick-links'>
                        {
                            quick__links.map((item, index) => (
                                <ListGroupItem key={index} className='ps-0 border-0'>
                                    <Link to={item.path}>{item.display}</Link>
                                </ListGroupItem>
                            ))
                        }
                    </ListGroup>
                </Col>
                <Col lg='3'>
                  <h5 className='footer__link-title'>Quick Links</h5>
                    <ListGroup className='footer__quick-links'>
                        {
                            quick__links2.map((item, index) => (
                                <ListGroupItem key={index} className='ps-0 border-0'>
                                    <Link to={item.path}>{item.display}</Link>
                                </ListGroupItem>
                            ))
                        }
                    </ListGroup>                    
                </Col>
                <Col lg='3'>
                  <h5 className='footer__link-title'>Contact</h5>
                    <ListGroup className='footer__quick-links'>
                            <ListGroupItem className='ps-0 border-0 d-flex align-items-center gap-3'>
                                <h6 className='mb-0 d-flex align-items-center gap-2'>
                                    <span><i className="ri-map-pin-line"></i></span>
                                    Address:
                                </h6>

                                <p className='mb-0'>702 Nguyen Van Linh District 7</p>
                            </ListGroupItem>
                            <ListGroupItem className='ps-0 border-0 d-flex align-items-center gap-3'>
                                <h6 className='mb-0 d-flex align-items-center gap-2'>
                                    <span><i className="ri-mail-line"></i></span>
                                    Email:
                                </h6>

                                <p className='mb-0'>cosmictravel@gmail.com</p>
                            </ListGroupItem>
                            <ListGroupItem className='ps-0 border-0 d-flex align-items-center gap-3'>
                                <h6 className='mb-0 d-flex align-items-center gap-2'>
                                    <span><i className="ri-phone-fill"></i></span>
                                    Phone:
                                </h6>

                                <p className='mb-0'>+(84) 123 456 789</p>
                            </ListGroupItem>
                    </ListGroup>                       
                </Col>
            </Row>
        </Container>
    </footer>
            <br></br>
            <hr className='col-10 mx-auto custom-hr'></hr>
            
    <div className='col-10 mx-auto'>
        <ul className='list-unstyled d-flex flex-row gap-3 justify-content-evenly'>
            <li>&copy; 2024 Cosmic Travel</li>
            <li><Link to="#" className='custom-anchor'>Terms of Service</Link></li>
            <li><Link to="#" className='custom-anchor'>Cookie consent</Link></li>
        </ul>
    </div>   
    </> 
};

export default Footer;