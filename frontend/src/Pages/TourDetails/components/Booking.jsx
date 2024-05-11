import React, {useState} from 'react';
import './booking.css'

import { Form, FormGroup, ListGroup, ListGroupItem, Button } from 'react-bootstrap';

const Booking = ({ tour, avgRating }) => {
    const [numPeople, setNumPeople] = useState(1);
    const { price, reviews } = tour;

    const incrementPeople = () => {
        setNumPeople(prevNumPeople => Math.min(prevNumPeople + 1, 10));
    };

    const decrementPeople = () => {
        setNumPeople(prevNumPeople => Math.max(prevNumPeople - 1, 1));
    };

    const handleBookFormChange = e => {

    }

    return (
        <div className='booking'>
            <div className="booking__top d-flex align-items-center justify-content-between">
                <h3>${price} <span>/ adult</span></h3>
                    <span className='tour__rating d-flex align-items-center'>
                        <i className="ri ri-star-s-fill"></i> 
                        {avgRating === 0 ? null : avgRating} ({reviews?.length})
                    </span>                 
            </div>

            {/* ==================== Booking form starts ================== */}
            <div className="booking__form">
                <h5>Information</h5>
                <Form className='booking_info-form d-flex flex-column justify-content-center align-items-flex-start p-3 gap-3'>
                    <div className='booking_first_container'>
                    <span>People</span>
                    <span><i className="fa-duotone fa-user-group"></i></span>
                    <span className='wrapper'>
                        <span className='minus' onClick={decrementPeople}>-</span>
                        <span className='num'>{numPeople < 10 ? `0${numPeople}` : numPeople}</span>
                        <span className='plus' onClick={incrementPeople}>+</span>
                    </span> 
                    </div>
                    <FormGroup className='d-flex align-items-center gap-3'>
                        <input type='date' placeholder='' id="bookTime" required onChange={handleBookFormChange} />
                    </FormGroup>
                </Form>
            </div>    
            {/* ==================== Booking form ends ================== */}

            {/* ==================== Booking bottom ================== */}
            <div className='booking__bottom"'>
                <ListGroup>
                    <ListGroupItem className='border-0 px-0 book_form_row'>
                        <h5 className='d-flex align-items-center gap-1'>${price} <i className='ri-close-line'></i> 1 person</h5>
                        <span> ${price}</span>
                    </ListGroupItem>
                    <ListGroupItem className='border-0 px-0 book_form_row'>
                        <h5>Service charge</h5>
                        <span> $10</span>
                    </ListGroupItem>
                    <ListGroupItem className='border-0 px-0 total book_form_row'>
                        <h5>Total</h5>
                        <span> $109</span>
                    </ListGroupItem>
                </ListGroup>

                <Button className='btn primary__btn w-100 mt-4 book__btn normal__pad'>Book Now</Button>
            </div>
        </div>
    );
};

export default Booking