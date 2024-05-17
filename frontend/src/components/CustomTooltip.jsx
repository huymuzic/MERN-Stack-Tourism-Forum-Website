import PropTypes from 'prop-types';
import { useState } from 'react';

const CustomTooltip = ({ text, children, position }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const handleMouseEnter = () => {
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    const getPositionStyles = () => {
        switch (position) {
            case 'top':
                return { bottom: '125%', left: '50%', transform: 'translateX(-50%)' };
            case 'bottom':
                return { top: '125%', left: '50%', transform: 'translateX(-50%)' };
            case 'left':
                return { top: '50%', right: '125%', transform: 'translateY(-50%)' };
            case 'right':
                return { top: '50%', left: '125%', transform: 'translateY(-50%)' };
            default:
                return { bottom: '125%', left: '50%', transform: 'translateX(-50%)' };
        }
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block', width:'fit-content', height:'fit-content' }}>
            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                {children}
            </div>
            {showTooltip && (
                <span style={{ position: 'absolute', fontSize: "12px", backgroundColor: '#737272', color: '#fff', padding: '4px', borderRadius: '4px', whiteSpace: 'nowrap', ...getPositionStyles() }}>
                    {text}
                </span>
            )}
        </div>
    );
};

CustomTooltip.propTypes = {
    text: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
};

export default CustomTooltip;
