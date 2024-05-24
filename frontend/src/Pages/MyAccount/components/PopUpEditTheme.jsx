import { useEffect, useState } from 'react'
import PopUpBase from '../../../components/pop-up/PopUpBase'
import { Button, Col, Row, Stack } from 'react-bootstrap';
import { SketchPicker } from 'react-color';
import PropTypes from 'prop-types';
import { defaultSettingTheme } from "../index"
import { useTheme } from '../../../theme/Theme';

export default function PopUpEditTheme(props) {
    const [isDirty, setIsDirty] = useState(false);
    const [open, setOpen] = useState(false);
    const [pickerPosition, setPickerPosition] = useState({ x: 0, y: 0 });
    const [settingColors, setSettingColors] = useState();
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedChild, setSelectedChild] = useState(null);
    const {color, themeMode} = useTheme()


    const handleResetColor = () => {
        setIsDirty(true);
        setSettingColors(defaultSettingTheme)
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleClick = (x, y, key) => {
        setPickerPosition({ x, y });
        setOpen(true);
        setSelectedChild(key);

    };
    const handleChange = (color) => {
        setSelectedColor(color.hex);

        setIsDirty(true);

        settingColors[selectedChild] && setSettingColors((prev) => ({ ...prev, [selectedChild]: color.hex }));
    }


    useEffect(() => {
        if (!props.open) return;
        setIsDirty(false);

        setSettingColors(props.settingColors)
    }, [props.open, props.settingColors])
    return (
        <PopUpBase
            open={props.open}
            onClose={props.onClose}
            title={"Edit Setting Theme"}
            hideClose
            hideConfirm
            customActions={
                <Stack direction='horizontal' className="w-100 justify-content-between">
                    <Button style={{ width: "150px" }} variant="secondary" onClick={() => props.onClose?.()}>
                        Cancel
                    </Button>

                    <Button
                        style={{ width: "150px" }}
                        onClick={() => {
                            props.onSave?.(settingColors)
                        }}
                        disabled={!isDirty}
                    >
                        Save
                    </Button>
                </Stack>
            }
            desc={
                <Row style={{
                    borderRadius: 8,
                    backgroundColor: themeMode == "light" ? color.grey100 : color.grey500,
                    padding: 16,
                    margin: 8
                }}>
                    <Col xs={12}>
                        <Stack
                            direction={'horizontal'}
                            style={{
                                borderBottom: '1px solid #DDD',
                                paddingBottom: "16px",
                                marginBottom: "16px",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >
                            <h6 >Color system</h6>
                            <Button
                                sx={{ maxHeight: '32px', width: '102px', padding: '8px 16px', textWrap: 'nowrap', fontSize: "12px" }}
                                component="span"
                                variant="outline-primary"
                                onClick={handleResetColor}
                            >
                                Reset color
                            </Button>
                        </Stack>
                    </Col>
                    <Col xs={12}>
                        <Row>
                            <Col xs={3}>
                                <p style={{ textWrap: "nowrap", textAlign: "start" }} className='body-1'>
                                    Brand Color
                                </p>
                            </Col>
                            <Col xs={9}>
                                <Row>
                                    <Col xs={6} className="pb-3">
                                        <Row className="ps-3">
                                            <Col xs={12}>
                                                <div className="d-flex align-items-center gap-1">
                                                    <p className='body-2'>Primary</p>
                                                </div>
                                            </Col>
                                            <Col xs={12}>
                                                <Stack direction='horizontal'>
                                                    <div
                                                        style={{
                                                            boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
                                                            width: 20,
                                                            height: 20,
                                                            borderRadius: '50%',
                                                            backgroundColor: settingColors?.primary,

                                                        }}
                                                    />
                                                    <span
                                                        style={{ cursor: 'pointer', borderBottom: '2px dashed #DDDDDD', marginLeft: '8px' }}
                                                        onClick={(e) => {
                                                            setOpen(true)
                                                            handleClick(e.currentTarget.offsetLeft, e.currentTarget.offsetTop + 20, "primary");
                                                        }}
                                                    >
                                                        {settingColors?.primary}
                                                    </span>
                                                </Stack>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col xs={6} className="pb-3">
                                        <Row className="ps-3">
                                            <Col xs={12}>
                                                <div className="d-flex align-items-center gap-1">
                                                    <p className='body-2'>Secondary</p>
                                                </div>
                                            </Col>
                                            <Col xs={12}>
                                                <Stack direction='horizontal'>
                                                    <div
                                                        style={{
                                                            boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
                                                            width: 20,
                                                            height: 20,
                                                            borderRadius: '50%',
                                                            backgroundColor: settingColors?.secondary,

                                                        }}
                                                    />
                                                    <span
                                                        style={{ cursor: 'pointer', borderBottom: '2px dashed #DDDDDD', marginLeft: '8px' }}
                                                        onClick={(e) => {
                                                            setOpen(true)
                                                            handleClick(e.currentTarget.offsetLeft, e.currentTarget.offsetTop + 20, "secondary");
                                                        }}
                                                    >
                                                        {settingColors?.secondary}
                                                    </span>
                                                </Stack>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>


                    <Col xs={12}>
                        {/* <Row>
                            <Col xs={3}>
                                <p style={{ textWrap: "nowrap", textAlign: "start" }} className='body-1'>
                                    Header Color
                                </p>
                            </Col>
                            <Col xs={9}>
                                <Row>
                                    <Col xs={6} className="pb-3">
                                        <Row className="ps-3">
                                            <Col xs={12}>
                                                <div className="d-flex align-items-center gap-1">
                                                    <p className='body-2'>Text</p>
                                                </div>
                                            </Col>
                                            <Col xs={12}>
                                                <Stack direction='horizontal'>
                                                    <div
                                                        style={{
                                                            boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
                                                            width: 20,
                                                            height: 20,
                                                            borderRadius: '50%',
                                                            backgroundColor: settingColors?.headerTextColor,
                                                        }}
                                                    />
                                                    <span
                                                        style={{ cursor: 'pointer', borderBottom: '2px dashed #DDDDDD', marginLeft: '8px' }}
                                                        onClick={(e) => {
                                                            setOpen(true)
                                                            handleClick(e.currentTarget.offsetLeft, e.currentTarget.offsetTop + 20, "headerTextColor");
                                                        }}
                                                    >
                                                        {settingColors?.headerTextColor}
                                                    </span>
                                                </Stack>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col xs={6} className="pb-3">
                                        <Row className="ps-3">
                                            <Col xs={12}>
                                                <div className="d-flex align-items-center gap-1">
                                                    <p className='body-2'>Background</p>
                                                </div>
                                            </Col>
                                            <Col xs={12}>
                                                <Stack direction='horizontal'>
                                                    <div
                                                        style={{
                                                            boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
                                                            width: 20,
                                                            height: 20,
                                                            borderRadius: '50%',
                                                            backgroundColor: settingColors?.headerBgColor,
                                                        }}
                                                    />
                                                    <span
                                                        style={{ cursor: 'pointer', borderBottom: '2px dashed #DDDDDD', marginLeft: '8px' }}
                                                        onClick={(e) => {
                                                            setOpen(true)
                                                            handleClick(e.currentTarget.offsetLeft, e.currentTarget.offsetTop + 20, "headerBgColor");
                                                        }}
                                                    >
                                                        {settingColors?.headerBgColor}
                                                    </span>
                                                </Stack>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row> */}
                    </Col>


                    <Col xs={12}>
                        <Row>
                            <Col xs={3}>
                                <p style={{ textWrap: "nowrap", textAlign: "start" }} className='body-1'>
                                    Button Color
                                </p>
                            </Col>
                            <Col xs={9}>
                                <Row>
                                    <Col xs={6} className="pb-3">
                                        <Row className="ps-3">
                                            <Col xs={12}>
                                                <div className="d-flex align-items-center gap-1">
                                                    <p className='body-2'>Text</p>
                                                </div>
                                            </Col>
                                            <Col xs={12}>
                                                <Stack direction='horizontal'>
                                                    <div
                                                        style={{
                                                            boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
                                                            width: 20,
                                                            height: 20,
                                                            borderRadius: '50%',
                                                            backgroundColor: settingColors?.buttonTextColor,
                                                        }}
                                                    />
                                                    <span
                                                        style={{ cursor: 'pointer', borderBottom: '2px dashed #DDDDDD', marginLeft: '8px' }}
                                                        onClick={(e) => {
                                                            setOpen(true)
                                                            handleClick(e.currentTarget.offsetLeft, e.currentTarget.offsetTop + 20, "buttonTextColor");
                                                        }}
                                                    >
                                                        {settingColors?.buttonTextColor}
                                                    </span>
                                                </Stack>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col xs={6} className="pb-3">
                                        <Row className="ps-3">
                                            <Col >
                                                <div className="d-flex align-items-center gap-1">
                                                    <p className='body-2'>Hover</p>
                                                </div>
                                            </Col>
                                            <Col>
                                                <Stack direction='horizontal'>
                                                    <div
                                                        style={{
                                                            boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
                                                            width: 20,
                                                            height: 20,
                                                            borderRadius: '50%',
                                                            backgroundColor: settingColors?.buttonHoverColor,
                                                        }}
                                                    />
                                                    <span
                                                        style={{ cursor: 'pointer', borderBottom: '2px dashed #DDDDDD', marginLeft: '8px' }}
                                                        onClick={(e) => {
                                                            setOpen(true)
                                                            handleClick(e.currentTarget.offsetLeft, e.currentTarget.offsetTop + 20, "buttonHoverColor");
                                                        }}
                                                    >
                                                        {settingColors?.buttonHoverColor}
                                                    </span>
                                                </Stack>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    {open ? (
                        <div
                            style={{
                                position: 'absolute',
                                zIndex: '2',
                                top: `${pickerPosition.y}px`,
                                left: `${pickerPosition.x}px`,
                            }}
                        >
                            <div
                                style={{
                                    position: 'fixed',
                                    top: '0px',
                                    right: '0px',
                                    bottom: '0px',
                                    left: '0px',
                                }}
                                onClick={handleClose}
                            />
                            <SketchPicker color={selectedColor} onChange={handleChange} disableAlpha />
                        </div>
                    ) : null}
                </Row>
            }
        />
    )
}


PopUpEditTheme.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    settingColors: PropTypes.object // Add prop validation for settingColors
};