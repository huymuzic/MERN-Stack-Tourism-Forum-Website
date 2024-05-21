import "./service-card.css";

const ServiceCard = ({ item }) => {
  const { photo, title, desc, type } = item;

  return (
    <div className="service__item">
      <div className="service__img">
        <img src={photo} alt={type} />
      </div>
      <h5>{title}</h5>
      <p className="service__p">{desc}</p>
    </div>
  );
};

export default ServiceCard;
