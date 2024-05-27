import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import { FaEdit, FaLock, FaUnlock } from "react-icons/fa";
import CustomTooltip from "../../../../components/CustomTooltip";
import { usePopUp } from "../../../../components/pop-up/usePopup";
import PopUpBase from "../../../../components/pop-up/PopUpBase";
import color from "../../../../theme/Color";
import calculateAvgRating from "../../../../utils/avgRating";
import { useState } from "react";
import PopUpUpdateTour from "./TourChange";
import { Form, Stack } from "react-bootstrap";

const TourItem = ({
  tour,
  handleUpdateTour,
  handleUnhideConfirm,
  handleHideConfirm,
}) => {
  const popUpChangeTour = usePopUp();
  const [avgRating, setAvgRating] = useState(calculateAvgRating(tour.reviews));
  const [isEditOpen, setEditOpen] = useState(false);
  const popUpActivate = usePopUp();
  const TourStatus = TourStatuses.find((item) => item.Value === tour.status);

  const onChangeStatus = () => {
    popUpActivate.onClose();
    if (TourStatus.Value === "unhide") {
      return handleHideConfirm(tour._id);
    } else {
      return handleUnhideConfirm(tour._id);
    }
  };

  const handleConfirmUpdate = (data) => {
    handleUpdateTour(data);
    setEditOpen(false); 
  };

  return (
    <div className="card mb-3 shadow-sm rounded border-0" tabIndex="0">
      <div className="card-body">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
          <div>
            <Link to={`/tours/${tour._id}`} className="text-decoration-none" tabIndex="0" aria-label={`View details for tour titled ${tour.title || "No title"}`}>
              <h5 className="card-title text-primary">
                {tour.title || "No title"}
              </h5>
            </Link>
            <div className="d-flex flex-column mt-2">
              <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mb-2">
                <p className="card-text me-0 me-md-3 mb-1 mb-md-0" tabIndex="0" aria-label={`Location: ${tour.city}, ${tour.country}`}>
                  <strong className="text-muted">
                    Location: {`${tour.city}, ${tour.country}` || "None"}
                  </strong>
                </p>
              </div>
              <p className="card-text mb-1" tabIndex="0" aria-label={`Posted on ${moment(tour.updatedAt).format("YYYY-MM-DD HH:mm:ss")}`}>
                <small className="text-muted">
                  Posted: {moment(tour.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                </small>
              </p>
              <p className="card-text mb-1">
                <small className="text-muted" tabIndex="0" aria-label={`Reviews: ${tour?.reviews.length}`}>
                  Reviews: {tour?.reviews.length} <br />
                </small>
                <small className="text-muted" tabIndex="0" aria-label={`Average Score: ${avgRating.avgRating}`}>
                  Average Score:{" "}
                  <i className="ri ri-star-s-fill text-warning"></i>
                  {avgRating.avgRating}
                </small>
              </p>
            </div>
          </div>
          <div className="d-flex flex-column align-items-end mt-3 mt-md-0">
            <div className="d-flex mb-2">
              <TourRatingBox status={avgRating.avgRating} className="me-2" />
              <TourStatusBox status={tour.status} />
            </div>
            <div className="d-flex align-items-center">
              <CustomTooltip text="Edit Tour" position="top">
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => setEditOpen(true)}
                  data-tip="Edit Tour"
                  tabIndex="0"
                  aria-label="Edit Tour"
                >
                  <FaEdit size={14} />
                </button>
              </CustomTooltip>
              <CustomTooltip
                text={TourStatus.Value === "unhide" ? "Hide" : "Unhide"}
                position="top"
              >
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => popUpActivate.setTrue()}
                  data-tip={TourStatus.Value === "unhide" ? "Hide" : "Unhide"}
                  tabIndex="0"
                  aria-label={TourStatus.Value === "unhide" ? "Hide Tour" : "Unhide Tour"}
                >
                  {TourStatus.Value === "unhide" ? (
                    <FaLock size={14} />
                  ) : (
                    <FaUnlock size={14} />
                  )}
                </button>
              </CustomTooltip>
              <PopUpBase
                {...popUpActivate}
                onConfirm={onChangeStatus}
                title="Change Tour Status Confirmation"
                desc={`Are you sure you want to ${
                  TourStatus.Value === "unhide" ? "hide" : "unhide"
                } this tour?`}
              />
            </div>
          </div>
        </div>
        <hr />
        <Link
          to={`/tours/${tour._id}`}
          className="btn btn-sm btn-outline-secondary"
          tabIndex="0"
          aria-label="Read more about this tour"
        >
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
    updatedAt: PropTypes.string,
    reviews: PropTypes.array,
    photo: PropTypes.string,
  }).isRequired,
  handleUpdateTour: PropTypes.func.isRequired,
  handleUnhideConfirm: PropTypes.func.isRequired,
  handleHideConfirm: PropTypes.func.isRequired,
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
    Name: "Normal Feedback",
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
      tabIndex="0"
      aria-label={`Rating: ${TourRate?.Name}`}
    >
      <p style={{ color: TourRate?.color, margin: 0 }}>{TourRate?.Name}</p>
    </div>
  );
};

TourRatingBox.propTypes = {
  status: PropTypes.number.isRequired,
};

export const TourStatuses = [
  {
    Id: 1,
    Value: "unhide",
    Name: "Unhide",
    bgColor: color.successLight,
    color: color.success,
  },
  {
    Id: 2,
    Value: "hide",
    Name: "Hide",
    bgColor: color.lightDanger,
    color: color.danger,
  },
];

export const TourStatusBox = ({ status }) => {
  const TourStatus = TourStatuses.find((item) => status === item.Value);
  return (
    <div
      className="px-2 py-1 rounded"
      style={{ backgroundColor: TourStatus?.bgColor }}
      tabIndex="0"
      aria-label={`Status: ${TourStatus?.Name}`}
    >
      <p style={{ color: TourStatus?.color, margin: 0 }}>{TourStatus?.Name}</p>
    </div>
  );
};

TourStatusBox.propTypes = {
  status: PropTypes.string.isRequired,
};
