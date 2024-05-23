import PropTypes from 'prop-types';
import { useTheme } from '../../../theme/Theme';


function WrapperFilter(props) {
    const { color, themeMode } = useTheme()
    return (
        <div className={`p-3 rounded`} style={{backgroundColor: themeMode == "light" ? color.grey200 : "#4a4949"}}>
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <IcFilter />
                    <span className='px-3'>Filter</span>
                    <button className="btn btn-secondary btn-sm" onClick={props.onReset}>
                        Reset
                    </button>
                </div>
                <div className="w-50">{props.customAction}</div>
            </div>
            {props.children}
        </div>
    );
}
WrapperFilter.propTypes = {
    onReset: PropTypes.func,
    customAction: PropTypes.node,
    children: PropTypes.node
};
export default WrapperFilter;


function IcFilter() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" fill="none" viewBox="0 0 17 16" >
            <g clipPath="url(#clip0_3604_3262)">
                <path
                    fill="#85858A"
                    fillRule="evenodd"
                    d="M1.35 3a.75.75 0 100 1.5h14.5a.75.75 0 000-1.5H1.35zM3.6 7.75A.75.75 0 014.35 7h8.5a.75.75 0 010 1.5h-8.5a.75.75 0 01-.75-.75zm3 4a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75z"
                    clipRule="evenodd"
                ></path>
            </g>
            <defs>
                <clipPath id="clip0_3604_3262">
                    <path fill="#fff" d="M0 0H16V16H0z" transform="translate(.6)"></path>
                </clipPath>
            </defs>
        </svg>
    )
}