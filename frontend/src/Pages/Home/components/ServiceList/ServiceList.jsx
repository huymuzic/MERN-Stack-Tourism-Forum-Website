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
        desc: 'lorem',
    },
    {
        imgUrl: customizationImg,
        title: 'Customization',
        desc: 'lorem',
    },
    {
        imgUrl: cancellationImg,
        title: 'Cancellation',
        desc: 'lorem',
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