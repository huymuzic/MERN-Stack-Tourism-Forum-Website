import React from 'react';
import './booking.css'

import { Form, FormGroup, ListGroup, ListGroupItem, Button } from 'react-bootstrap';

const Booking = ({ tour, avgRating }) => {

    const { price, reviews } = tour;

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
                <Form className='booking_info-form d-flex flex-column justify-content-center align-items-flex-start gap-3'>
                    <FormGroup>
                        <input type='text' placeholder='Full Name' id="fullName" required onChange={handleBookFormChange} />
                    </FormGroup>
                    <FormGroup>
                        <input type='number' placeholder='Phone' id="phone" required onChange={handleBookFormChange} />
                    </FormGroup>
                    <FormGroup className='d-flex align-items-center gap-3'>
                        <input type='date' placeholder='' id="bookTime" required onChange={handleBookFormChange} />
                        <input type='number' placeholder='Guest' id="guestSize" required onChange={handleBookFormChange} />
                    </FormGroup>
                </Form>
            </div>    
            {/* ==================== Booking form ends ================== */}
        </div>
    )
}

export default Booking