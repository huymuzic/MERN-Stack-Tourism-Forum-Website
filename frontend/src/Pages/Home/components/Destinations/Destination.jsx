import PropTypes from "prop-types";
import { useState } from "react";
import "./destination-list.css";
import { useSearch } from "../../../../utils/SearchContext";
import { environment } from "../../../../config";

const Destination = ({ item }) => {
  const [imageBrightness, setImageBrightness] = useState(0.8);
  const { searchHandler } = useSearch();

  const handleMouseEnter = () => {
    setImageBrightness(1);
  };

  const handleMouseLeave = () => {
    setImageBrightness(0.8);
  };

  const handleDestinationClick = () => {
    searchHandler({ city: item.title });
  };

  const handleKeyDown = (event) => {
    event.preventDefault();
    if (event.key === "Enter") {
      handleDestinationClick();
    }
  };

  const { photo, title } = item;
  return (
    <div>
      <div
        tabIndex="0"
        className="containerz"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleDestinationClick}
        onKeyDown={handleKeyDown}
      >
        <img
          className="images"
          src={environment === "PROD" ? photo : `./src${photo}`}
          alt="top-destination"
          style={{ filter: `brightness(${imageBrightness})` }}
        />
        <div className="titleContainer">
          <div className="topDestinationLink">
            <strong>{title}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

Destination.propTypes = {
  item: PropTypes.shape({
    photo: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default Destination;
