import PropTypes from "prop-types";
import { useTheme } from "../../../../theme/Theme";
import "./service-card.css";

const ServiceCard = ({ item }) => {
  const { photo, title, desc, type } = item;
  const { color } = useTheme();
  return (
    <div className="service__item">
      <div
        className="service__img"
        style={{ backgroundColor: color.secondary }}
      >
        <img src={photo} alt={type} />
      </div>
      <h5>{title}</h5>
      <p className="service__p">{desc}</p>
    </div>
  );
};

ServiceCard.propTypes = {
  item: PropTypes.shape({
    photo: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
};

export default ServiceCard;
