import React, { useRef, useState} from 'react'
import './index.css'
import { Container, Row, Col, Form, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import tourData from '../../assets/data/tour';
import calculateAvgRating from '../../utils/avgRating';
import Booking from './components/Booking';
import { pushSuccess } from '../../components/Toast';
import { useUser } from '../../utils/UserContext';
import { getAvatarUrl } from '../../utils/getAvar.js';

const TourDetails = () => {
    const baseURL = import.meta.env.VITE_BASE_URL;
    const {user, setUser } = useUser();
    const avatarUrl = getAvatarUrl(user?.avatar, baseURL);
    const { id } = useParams();
    const reviewMsgRef = useRef('');
    const [tourRating, setTourRating] = useState(null);

    const tour = tourData.find(tour => tour.id === id)

    const { photo, title, price, reviews, city, duration, ageRange } = tour;

    const { totalRating, avgRating } = calculateAvgRating(reviews);

    // format date
    const options = { day: 'numeric', month: 'long', year: 'numeric' };

    // submit request to the server
    const submitHandler = e => {
        e.preventDefault()
        const reviewText = reviewMsgRef.current.value
        pushSuccess(`${reviewText}, ${tourRating}`);
    }

    return <>
    
        <section>
        <Container>
            <Row>
                <Col lg='8'>
                    <div className="tour__content">
                        <h2>{title}</h2>

                        <div className='d-flex align-items-center gap-2'>

                        <span className='tour__rating d-flex align-items-center gap-1'>
                            <i className="ri ri-star-s-fill"></i> {avgRating === 0 ? null : avgRating} 
                            {totalRating === 0 ? ('Not rated') : ( 
                            <span>({reviews?.length})</span>
                            )}
                        </span> 
                        <span>|</span>
                        <span><i className='ri-map-pin-2-line'></i> {city}</span>

                        </div>                       
                        <img src={photo} alt='' />

                        <div className="tour__info">
                            <div className='d-flex flex-column align-items-start justify-content-center tour__extra-details'>
                                <h5>Description</h5>
                                <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti ipsam dolorem provident ex earum quis, corporis quisquam eius quasi exercitationem.</div>
                                <span><i className='ri-money-dollar-circle-line '></i>from ${price} / adult</span>
                                <hr className='col-12 mx-auto custom-hr'></hr>
                                <span><i className='ri-group-line'></i>Age {ageRange}</span>
                                <span><i className="ri-time-line"></i>Duration: {duration} days</span>
                                <span><i className="fa-light fa-bed-front"></i>Accommodation included</span>
                                <hr className='col-12 mx-auto custom-hr'></hr>
                                <span>FAQ</span>
                                <hr className='col-12 mx-auto custom-hr'></hr>
                            </div>
                        </div>

                        {/* ============ tour reviews section ================= */}
                        <div className='tour__reviews mt-4'>
                            <h4>Reviews ({reviews?.length} reviews)</h4>

                            <Form onSubmit={submitHandler}>
                                <div className='d-flex align-items-center justify-content-end gap-3 mb-4 rating__group'>
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <span key={i} onClick={() => setTourRating(i + 1)}>
                                            <i className={`
                                                ri ${i < tourRating ? 'ri-star-s-fill' : 'ri-star-line'}
                                            `}></i>
                                        </span>
                                    ))}
                                </div>

                                <div className="review__input">
                                    <input type='text' ref={reviewMsgRef} placeholder='Share your thoughts...' required></input>
                                    <button className='btn primary__btn text-white' type='submit'>Submit</button>
                                </div>
                            </Form>

                            <ListGroup className='user__reviews'>
                                {
                                   reviews?.map(review => (
                                    <div className='review__item'>
                                     <img
                                        src={avatarUrl}
                                        alt="User Avatar"
                                        className="rounded-circle"
                                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                    />

                                        <div className="w-100">
                                            <div className='d-flex align-items-center justify-content-between'>
                                                <div>
                                                    <h5>HuyMusic</h5>
                                                    <p>
                                                        {new Date('05-09-2024').toLocaleDateString('en-US', options)}
                                                    </p>
                                                </div>
                                                <span className='d-flex align-items-center'>
                                                    5<i className='ri ri-star-s-fill'></i>
                                                </span>
                                            </div>
                                            <h6>Amazing Tour</h6>
                                        </div>
                                    </div>
                                   )) 
                                }
                            </ListGroup>
                        </div>
                        {/* ============ tour reviews section ends ================= */}
                    </div>
                </Col>

                <Col lg='4'>
                    <Booking tour={tour} avgRating={avgRating} />
                </Col>
            </Row>
        </Container>
    </section>
    
    
    </>;
};

export default TourDetails;