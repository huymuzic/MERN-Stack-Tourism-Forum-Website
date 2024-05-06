import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

function AutocompleteOption(props) {
    const [backgroundColor, setBackgroundColor] = useState(props.select ? '#E5F5ED' : 'inherit');

    useEffect(() => {
        setBackgroundColor(props.select ? '#E5F5ED' : 'inherit');
    }, [props.select]);

    const handleMouseEnter = () => {
        setBackgroundColor(props.select ? '#E5F5ED' : '#eeeeee');
    };

    const handleMouseLeave = () => {
        setBackgroundColor(props.select ? '#E5F5ED' : 'inherit');
    };

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        props.onClick?.(props.option);
    };

    return (
        <div className="cursor-pointer" onClick={handleClick}>
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
