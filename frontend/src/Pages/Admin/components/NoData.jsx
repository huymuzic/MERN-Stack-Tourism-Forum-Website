import PropTypes from 'prop-types';
import { MdOutlineNotInterested } from "react-icons/md";

const NoData = ({ children }) => {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: '#FAFAFA', minHeight: '450px' }}>
            <MdOutlineNotInterested size={"48px"}/>
            {children}
        </div>
    );
};

NoData.propTypes = {
    children: PropTypes.node.isRequired,
};

export default NoData;
