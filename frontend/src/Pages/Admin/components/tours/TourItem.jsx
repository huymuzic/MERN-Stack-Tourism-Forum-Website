import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import { FaWrench } from "react-icons/fa";
import CustomToolTip from "../../../../components/CustomTooltip";
import { usePopUp } from "../../../../components/pop-up/usePopup";
import color from "../../../../theme/Color";
import calculateAvgRating from "../../../../utils/avgRating";
import { useState, useEffect } from "react";
import PopUpUpdateTour from "./TourChange";

const TourItem = ({ tour, statusFilter, handleUpdateTour }) => {
  const popUpChangeTour = usePopUp();
  const [avgRating, setAvgRating] = useState(calculateAvgRating(tour.reviews));
  const [isEditOpen, setEditOpen] = useState(false);

  // Check if avgRating matches the status filter
  useEffect(() => {
    if (statusFilter) {
      const numericStatus = parseFloat(avgRating.avgRating);
      const statusMatch = TourRating.find(
        (item) =>
          numericStatus >= item.Value[0] &&
          numericStatus <= item.Value[1] &&
          item.Name === statusFilter.Name
      );
      if (!statusMatch) {
        // Do not render this tour item if it doesn't match the status filter
        setAvgRating(null);
      }
    }
  }, [avgRating, statusFilter]);

  if (!avgRating) {
    return null; // Do not render the component if avgRating is null
  }

  const handleConfirmUpdate = (data) => {
    handleUpdateTour(data);
    setEditOpen(false); // Close the popup after updating
  };

  return (
    <div className="card mb-3 shadow-sm rounded border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Link to={`/tours/${tour._id}`} className="text-decoration-none">
              <h5 className="card-title text-primary">{tour.title || "No title"}</h5>
            </Link>
            <div className="d-flex flex-column mt-2">
              <div className="d-flex flex-row align-items-center mb-2">
                <p className="card-text me-3 mb-0">
                  <strong className="text-muted">
                    Location: {`${tour.city}, ${tour.country}` || "None"}
                  </strong>
                </p>
              </div>
              <p className="card-text mb-0">
                <small className="text-muted">
                  Posted: {moment(tour.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                </small>
              </p>
              <p className="card-text mb-0">
                <small className="text-muted">
                  Reviews: {tour?.reviews.length} <br />
                </small>
                <small className="text-muted d-flex align-items-center">
                  Average Score: <i className="ri ri-star-s-fill text-warning ms-1" style={{ fontSize: "1.2em" }}></i>
                  {tour?.reviews.length == 0 ? 'Dont have review yet' : avgRating.avgRating}
                </small>
              </p>
            </div>
          </div>
          <div className="d-flex flex-column align-items-end">
            <TourRatingBox status={avgRating.avgRating} />
            <CustomToolTip text="Change Post" position="top">
              <button
                className="btn btn-sm btn-outline-primary mt-2"
                onClick={() => setEditOpen(true)}
                data-tip="Change Tour"
              >
                <FaWrench size={14} />
              </button>
            </CustomToolTip>
          </div>
        </div>
        <hr />
        <Link to={`/tours/${tour._id}`} className="btn btn-sm btn-outline-secondary">
          Read More...
        </Link>

        <PopUpUpdateTour
          open={isEditOpen}
          onClose={() => setEditOpen(false)}
          tour={tour}
          onConfirm={handleConfirmUpdate}
        />
      </div>
    </div>
  );
};

TourItem.propTypes = {
  tour: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    country: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    reviews: PropTypes.array,
  }).isRequired,
  statusFilter: PropTypes.object, // Add statusFilter prop type
  handleUpdateTour: PropTypes.func.isRequired,
};

export default TourItem;

export const TourRating = [
  {
    Id: 1,
    Value: [4.1, 5],
    Name: "Positive Feedback",
    bgColor: color.successLight,
    color: color.success,
  },
  {
    Id: 2,
    Value: [2.5, 4],
    Name: "Mixed Feedback",
    bgColor: color.grey200,
    color: color.grey400,
  },
  {
    Id: 3,
    Value: [0, 2.5],
    Name: "Negative Feedback",
    bgColor: color.lightDanger,
    color: color.danger,
  },
];

export const TourRatingBox = ({ status }) => {
  const numericStatus = parseFloat(status);
  const TourRate = TourRating.find(
    (item) => numericStatus >= item.Value[0] && numericStatus <= item.Value[1]
  );

  return (
    <div
      className="px-2 py-1 rounded"
      style={{ backgroundColor: TourRate?.bgColor }}
    >
      <p style={{ color: TourRate?.color, margin: 0 }}>{TourRate?.Name}</p>
    </div>
  );
};

TourRatingBox.propTypes = {
  status: PropTypes.number.isRequired,
};
