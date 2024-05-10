import React, { useState, useRef } from 'react';
import './search-bar.css';
import { Col, Form, FormGroup} from 'react-bootstrap';

const SearchBar = () => {

    // Form validation
    const locationRef = useRef('');
    const distanceRef = useRef(0);
    const tourPeriodRef = useRef(0);

    const [errors, setErrors] = useState({}); // State for validation errors


    let locationPattern = /^[a-zA-Z\s\-]+$/;
    let distancePattern = /^\d{1,8}$/;
    let tourPeriodPattern = /^\d{1,2}$/;

    const searchHandler = () => {

        const location = locationRef.current.value
        const distance = distanceRef.current.value
        const tourPeriod = tourPeriodRef.current.value

        const newErrors = {}; // Object to store validation errors

    if (!location) {
      newErrors.location = 'Location is required.';
    } else if (!locationPattern.test(location)) {
      newErrors.location = 'Please enter a valid location (only characters allowed)';
    }

    if (!distance) {
      newErrors.distance = 'Distance is required.';
    } else if (!distancePattern.test(distance)) {
      newErrors.distance = 'Please enter a valid distance (max 8 numbers)';
    }

    if (!tourPeriod) {
      newErrors.tourPeriod = 'Tour period is required.';
    } else if (!tourPeriodPattern.test(tourPeriod)) {
      newErrors.tourPeriod = 'Please enter a valid tour period (max 2 numbers)';
    }

    setErrors(newErrors); // Update errors state

    if (Object.keys(newErrors).length === 0) {
      // All fields are valid, submit the form (e.g., using fetch)
      console.log('Form submitted successfully!');
    }
  
};



    return <Col lg='12'>
        <div className='search__bar'>
            <Form className='d-flex align-items-center gap-4'>
                <FormGroup className='form-group d-flex gap-3 form__group form__group-fast'>
                    <span>
                        <i className="ri ri-map-pin-line"></i>
                    </span>
                    <div>
                        <h6>Location</h6>
                        <input type='text' placeholder="Where are you going?" ref={locationRef} aria-describedby="location-error" /> 
                        <div id="location-error" className="error-message">
                            {errors.location}
                        </div>                          
                    </div>
                </FormGroup>
                <FormGroup className='form-group d-flex gap-3 form__group form__group-fast'>
                    <span>
                        <i className="ri ri-map-pin-time-line"></i>
                    </span>
                    <div>
                        <h6>Distance</h6>
                        <input id = "distance" type="number" placeholder="Distance k/m" ref={distanceRef} aria-describedby="distance-error" />
                        <div id="distance-error" className="error-message">
                            {errors.distance}
                        </div>                              
                    </div>
                </FormGroup>
                <FormGroup className='form-group d-flex gap-3 form__group form__group-last'>
                    <span>
                        <i className="ri ri-group-line"></i>
                    </span>
                    <div>
                        <h6>Tour Period</h6>
                        <input id = "tourPeriod" type="number" placeholder="0" ref={tourPeriodRef} aria-describedby="distance-error" />
                        <div id="tourPeriod-error" className="error-message">
                            {errors.tourPeriod}
                        </div>      
                    </div>
                </FormGroup>   
                <span className = "search__icon" type = "submit" onClick={searchHandler}>
                    <i class="ri-search-line"></i>
                </span>                             
            </Form>
        </div>
    </Col>
}

export default SearchBar;