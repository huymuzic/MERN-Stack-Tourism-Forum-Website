import PropTypes from 'prop-types';
import { MdOutlineNotInterested } from "react-icons/md";
import { useTheme } from '../../../theme/Theme';

const NoData = ({ children }) => {
    const { themeMode } = useTheme()
    return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: themeMode == "light" ? '#FAFAFA' : "#4a4949", minHeight: '450px' }}>
            <MdOutlineNotInterested size={"48px"} />
            {children}
        </div>
    );
};

NoData.propTypes = {
    children: PropTypes.node.isRequired,
};

export default NoData;
