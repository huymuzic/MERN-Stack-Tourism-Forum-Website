import React from 'react'
import TourCard from '../../../../Shared/TourCard'
import tourData from '../../../../assets/data/tour'
import { Col } from 'react-bootstrap';

const FeaturedTourList = () => {
    return <>
        {tourData?.map(tour => (
            <Col lg='3' className='mb-4' key={tour.id}>
                <TourCard tour={tour} />
            </Col>
        ))}
    </>
};

export default FeaturedTourList;