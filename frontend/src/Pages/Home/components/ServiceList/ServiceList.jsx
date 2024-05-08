import React from 'react'
import ServiceCard from './ServiceCard';
import { Col } from 'react-bootstrap';
import tourGuideImg from '../../../../assets/images/guide.png';
import customizationImg from '../../../../assets/images/customization.png';
import cancellationImg from '../../../../assets/images/cancellation.png';

const serviceData = [
    {
        imgUrl: tourGuideImg,
        title: 'Best Tour Guide',
        desc: '69k+ successful trips',
    },
    {
        imgUrl: customizationImg,
        title: 'Customization',
        desc: 'Multiple color themes',
    },
    {
        imgUrl: cancellationImg,
        title: 'Free cancellation',
        desc: 'Stay flexible on your trip',
    },
]

const ServiceList = () => {
    return <>
        {
            serviceData.map((item, index) => <Col lg='3' key={index}><ServiceCard item={item} /></Col>)
        }
    </>;
};

export default ServiceList;