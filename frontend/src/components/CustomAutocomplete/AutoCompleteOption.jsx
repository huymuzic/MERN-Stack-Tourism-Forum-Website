import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTheme } from '../../theme/Theme';

function AutocompleteOption(props) {
    const { color, themeMode } = useTheme()
    const [backgroundColor, setBackgroundColor] = useState(props.select ? color.lightPrimary : 'inherit');

    useEffect(() => {
        setBackgroundColor(props.select ? color.lightPrimary : 'inherit');
    }, [props.select]);

    const handleMouseEnter = () => {
        setBackgroundColor(props.select ? color.lightPrimary : (themeMode == "light" ? '#eeeeee' : "#353535"));
    };

    const handleMouseLeave = () => {
        setBackgroundColor(props.select ? color.lightPrimary : 'inherit');
    };

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        props.onClick?.(props.option);
    };

    return (
        <div className="cursor-pointer" onClick={handleClick} tabIndex={0} onKeyDown={(event) => {
            if (event.key === 'Enter') {
                handleClick(event);
            }
        }}>
            <div
                className="p-2 rounded-3 cursor-pointer"
                style={{
                    transition: '0.2s',
                    cursor: 'pointer',
                    backgroundColor: backgroundColor,
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {props.renderOption(props.option)}
            </div>
        </div>
    );
}

AutocompleteOption.propTypes = {
    option: PropTypes.any.isRequired,
    renderOption: PropTypes.func.isRequired,
    onClick: PropTypes.func,
    stackProps: PropTypes.object,
    select: PropTypes.bool,
};

export default AutocompleteOption;
