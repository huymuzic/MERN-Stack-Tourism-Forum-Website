import { useCallback, useEffect, useRef, useState } from 'react';
import AutocompleteOption from './AutoCompleteOption';
import PropTypes from 'prop-types';
import debounce from '../../helper';

const isEqual = (optionA, optionB) => {
    return optionA === optionB;
};

function activeStyles(props, active) {
    return active ? props : undefined;
}

function CustomAutocomplete(props) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);

    const { isRequired = false } = props;

    const handleChangeSearch = useCallback(
        debounce((text) => {
            props.handleChangeSearch?.(text);
        }, 300),
        [props.handleChangeSearch],
    );

    // const toggle = () => {
    //     setOpen(!open);
    // };

    const handleClose = () => {
        setOpen(false);
        handleChangeSearch('');
    };

    useEffect(() => {
        setInputValue(props.value ? props.getOptionLabel(props.value) : '');
    }, [props.value]);

    useEffect(() => {
        if (open) {
            // if (searchValue) {
            //     props.handleChangeSearch?.('');
            //     setSearchValue('');
            // }
        } else {
            setInputValue(props.value ? props.getOptionLabel(props.value) : '');
            // if (searchValue) {
            //     props.handleChangeSearch?.('');
            //     setSearchValue('');
            // }
        }
    }, [open]);

    useEffect(() => {
        setSearchLoading(props.searchLoading);
    }, [props.paging.rows, props.searchLoading]);

    const items = props.paging.rows;

    const handleChangeText = (e) => {
        setInputValue(e.target.value);
        if (open) {
            handleChangeSearch(e.target.value);
            setSearchLoading(true);
        }
    };

    const refZ = useRef(null);
    const labelRef = useRef(null);
    const inputContainerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (refZ.current && !refZ.current.contains(event.target)) {
                handleClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (open) {
            labelRef.current?.classList.add('focused');
            inputContainerRef.current?.classList.add('focused');
        } else {
            labelRef.current?.classList.remove('focused');
            inputContainerRef.current?.classList.remove('focused');
        }
    }, [open]);

    return (
        <div ref={refZ} style={{ width: props.wrapperWidth ?? 'auto' }}>
            <div className="position-relative">
                <div className="position-relative">

                    <label ref={labelRef} htmlFor="autocompleteInput">
                        {props.label}
                    </label>
                    <div className="input-group">
                        <input
                            id="autocompleteInput"
                            type="text"
                            className="form-control"
                            required={isRequired}
                            value={inputValue}
                            disabled={props.loading || props.disabled || props.readOnly}
                            onFocus={(e) => {
                                if (props.loading || props.disabled || props.readOnly) return;
                                e.preventDefault();
                                e.stopPropagation();
                                setOpen(true);
                            }}
                            autoComplete="off"
                            onChange={handleChangeText}
                            placeholder={props.placeholder || 'All options'}
                            ref={inputContainerRef}
                        />
                    </div>
                </div>

                {open && (
                    <div className="position-absolute top-100 start-0 w-100 mt-1" style={{ zIndex: 10 }}>
                        <div className="card">
                            <div className="card-body p-3">
                                {!props.disabledAllOption && (
                                    <div style={activeStyles({ display: 'none' }, searchLoading)}>
                                        <AutocompleteOption
                                            option={undefined}
                                            select={!props.value}
                                            renderOption={() => (
                                                <p style={{ margin: 0 }}>
                                                    {props.placeholder || 'All options'}
                                                </p>
                                            )}
                                            onClick={() => {
                                                handleClose();
                                                props.onChange?.(undefined);
                                                props.handleChangeSearch?.('');
                                            }}
                                        />
                                    </div>
                                )}

                                {!searchLoading &&
                                    items.map((option) => (
                                        <AutocompleteOption
                                            key={props.getOptionLabel(option)}
                                            option={option}
                                            renderOption={(_option) => (
                                                <div className="d-flex justify-content-between">
                                                    <p style={{ margin: 0 }}>
                                                        {props.getOptionLabel(_option)}
                                                    </p>
                                                    {props.renderOptionTooltip?.(_option)}
                                                </div>
                                            )}
                                            onClick={(option) => {
                                                handleClose();
                                                props.onChange?.(option);
                                            }}
                                            select={
                                                props.isEqual?.(option, props.value) ??
                                                isEqual(option, props.value)
                                            }
                                        />
                                    ))}

                                {/* <div
                                    className="d-flex justify-content-center"
                                    style={activeStyles(
                                        { display: 'none' },
                                        !searchLoading && !items.length,
                                    )}
                                >
                                    <p color="grayText">No options</p>
                                </div> */}
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}

CustomAutocomplete.propTypes = {
    disabledAllOption: PropTypes.bool,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    label: PropTypes.node,
    value: PropTypes.any,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    isEqual: PropTypes.func,
    getOptionLabel: PropTypes.func.isRequired,
    renderOptionTooltip: PropTypes.func,
    handleChangeSearch: PropTypes.func.isRequired,
    searchLoading: PropTypes.bool.isRequired,
    loading: PropTypes.bool,
    paging: PropTypes.shape({
        rows: PropTypes.array.isRequired,
    }).isRequired,
    wrapperWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isRequired: PropTypes.bool,
};
export default CustomAutocomplete;
