import React from 'react'
import Destination from './Destination'
import { Col, Row } from 'react-bootstrap';

import lasVegasImg from '../../../../assets/images/las-vegas.jpg';
import romeImg from '../../../../assets/images/rome.jpg';
import parisImg from '../../../../assets/images/paris.jpg';
import londonImg from '../../../../assets/images/london.jpg';
import newYorkImg from '../../../../assets/images/newyork.jpg';
import washingtonDCImg from '../../../../assets/images/washington-dc.jpg';
import cancunImg from '../../../../assets/images/cancun.jpg';
import florenceImg from '../../../../assets/images/florence.jpg';
import barcelonaImg from '../../../../assets/images/barcelona.jpg';
import oahuImg from '../../../../assets/images/oahu.jpg';

const destinationData1 = [
    {
        imgUrl: lasVegasImg,
        title: 'Las Vegas'
    },
    {
        imgUrl: romeImg,
        title: 'Rome'
    },
    {
        imgUrl: parisImg,
        title: 'Paris'
    },
    {
        imgUrl: londonImg,
        title: 'London'
    },
    {
        imgUrl: newYorkImg,
        title: 'New York'
    },
]

const destinationData2 = [
    {
        imgUrl: washingtonDCImg,
        title: 'Washington DC'
    },
    {
        imgUrl: cancunImg,
        title: 'Cancun'
    },
    {
        imgUrl: florenceImg,
        title: 'Florence'
    },
    {
        imgUrl: barcelonaImg,
        title: 'Barcelona'
    },
    {
        imgUrl: oahuImg,
        title: 'Oahu'
    },
]


const DestinationList = () => {
    // let displayedData1;
    // let displayedData2;
    // if (window.innerWidth <= 576) {
    //     displayedData1 = destinationData1.slice(0, 1);
    //     displayedData2 = destinationData2.slice(0, 1);
    // } else if (window.innerWidth <= 992) {
    //     displayedData1 = destinationData1.slice(0, 3)
    //     displayedData2 = destinationData2.slice(0, 3) 
    // } else if (window.innerWidth <= 1200) {
    //     displayedData1 = destinationData1; 
    //     displayedData2 = destinationData2;
    // }
    return <>
            <Row className="destination-list-1">
                {destinationData1.map((item, index) => (
                    <Col key={index}>
                        <Destination item={item} />
                    </Col>
                ))}
            </Row>
            <Row className="destination-list-2">
                {destinationData2.map((item, index) => (
                    <Col key={index}>
                        <Destination item={item} />
                    </Col>
                ))}
            </Row>         
    </>
};

export default DestinationList;