import React from 'react'
import Destination from './Destination'
import { Col, Row } from 'react-bootstrap';

import useFetch from '../../../../hooks/useFetch'

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
    const baseURL = 'http://localhost:4000/api/v1';


const DestinationList = () => {

    const {data: topDestinations} = useFetch(`${baseURL}/tours/search/getTopDestinations`);

    console.log(topDestinations);
    
    const firstHalf = [];
    const secondHalf = [];

    for (let i = 0; i < topDestinations.length; i++) {
    if (i < 5) {
        firstHalf.push(topDestinations[i]);
    } else {
        secondHalf.push(topDestinations[i]);
    }
    }  


    return <>
            <Row className="destination-list-1">
                {firstHalf.map((item, index) => (
                    <Col key={index}>
                        <Destination item={item} />
                    </Col>
                ))}
            </Row>
            <Row className="destination-list-2">
                {secondHalf.map((item, index) => (
                    <Col key={index}>
                        <Destination item={item} />
                    </Col>
                ))}
            </Row>         
    </>
};

export default DestinationList;