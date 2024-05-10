import { toast } from "react-toastify";
import { SuccessIcon } from "./icons/SuccessIcon";
import { ErrorIcon } from "./icons/ErrorIcon";
import { WarningIcon } from "./icons/WarningIcon";
import 'react-toastify/dist/ReactToastify.css';
import color from "../../theme/Color";

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
            background: color.successLight,
            borderColor: color.success,
            color: color.success,
        },
    });
};

const pushError = (message) => {
    toast.error(message, {
        icon: <ErrorIcon />,
        position: 'bottom-right',
        style: {
            ...baseStyle,
            background: color.lightDanger,
            borderColor: color.danger,
            color: color.danger,
        },
    });
};

const pushWarning = (message) => {
    toast.error(message, {
        icon: <WarningIcon />,
        position: 'bottom-right',
        style: {
            ...baseStyle,
            background: color.warningLight,
            borderColor: color.warning,
            color: color.warning,
        },
    });
};

export { pushError, pushSuccess, pushWarning }