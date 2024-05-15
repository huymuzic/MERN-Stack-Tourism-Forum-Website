import React from 'react';
import {useState} from 'react'
import './destination-list.css'

const Destination = ( {item} ) => {

    const [imageBrightness, setImageBrightness] = useState(0.8);

    const handleMouseEnter = () => {
      setImageBrightness(1);
    };

    const handleMouseLeave = () => {
      setImageBrightness(0.8);
    };


    const {photo, title} = item;
    return <>
          <div>
            <a href="#">
              <div className="containerz"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
              >
                <img
                  className="images"
                  src={photo}
                  alt=""
                  style={{ filter: `brightness(${imageBrightness})` }}
                />
                <div className="titleContainer">
                  <div className="topDestinationLink">
                    <strong>{title}</strong>
                  </div>
                </div>
              </div>
            </a>
          </div>    
    </>
};

export default Destination;