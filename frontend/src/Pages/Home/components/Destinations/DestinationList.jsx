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
    return <>
        <Row>
        {
            destinationData1.map((item, index) => <Col key={index}><Destination item={item} /></Col>)
        } 
        </Row>  
        <Row>
        {
            destinationData2.map((item, index) => <Col key={index}><Destination item={item} /></Col>)
        } 
        </Row>          
    </>
};

export default DestinationList;