import { toast } from "react-toastify";
import { SuccessIcon } from "./icons/SuccessIcon";
import { ErrorIcon } from "./icons/ErrorIcon";
import { WarningIcon } from "./icons/WarningIcon";
import 'react-toastify/dist/ReactToastify.css';

const baseStyle = {
    paddingLeft: `16px`,
    borderLeft: '2px solid',
    boxShadow: 'none',
    fontFamily: 'inherit',
};


const pushSuccess = (message) => {
    toast.success(message, {
        icon: <SuccessIcon />,
        position: 'bottom-right',
        style: {
            ...baseStyle,
            background: '#F0F6E1',
            borderColor: '#009D4F',
            color: '#009D4F',
        },
    });
};

const pushError = (message) => {
    toast.error(message, {
        icon: <ErrorIcon />,
        position: 'bottom-right',
        style: {
            ...baseStyle,
            background: '#F7E4E1',
            borderColor: "#E01B00",
            color: "#E01B00",
        },
    });
};

const pushWarning = (message) => {
    toast.error(message, {
        icon: <WarningIcon />,
        position: 'bottom-right',
        style: {
            ...baseStyle,
            background: '#FFF1B8',
            borderColor: '#FFB600',
            color: '#FFB600',
        },
    });
};

export { pushError, pushSuccess, pushWarning }