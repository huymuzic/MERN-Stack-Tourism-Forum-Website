import PropTypes from 'prop-types';

export default function PopUpBase(props) {
    return (
        <div>
            {props.open && <div className="modal-backdrop fade show"></div>}
            <div className="modal" style={{ display: props.open ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        {!props.hideTitle && (
                            <div className="modal-header">
                                <h5 className="modal-title text-center">{props.title}</h5>
                                {props.subTitle && <p className="text-success">{props.subTitle}</p>}
                                <button type="button" className="btn-close" aria-label="Close" onClick={props.onClose}></button>
                            </div>
                        )}
                        <div className="modal-body">{props.desc}</div>
                        {!(props.hideClose && props.hideConfirm) && (
                            <div className="modal-footer">
                                <div className='d-flex flex-row justify-content-between w-100'>
                                    {!props.hideClose && (
                                        <button type="button" className="btn btn-secondary" onClick={props.onClose}>
                                            Cancel
                                        </button>
                                    )}
                                    {!props.hideConfirm && (
                                        <button type="button" className="btn btn-danger" onClick={props.onConfirm}>
                                            Confirm
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                        {
                            props.customActions && <div className="modal-footer">
                                {props.customActions}
                            </div >
                        }
                    </div>
                </div>
            </div>
        </div>

    );
}

PopUpBase.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
    customActions: PropTypes.node,
    hideConfirm: PropTypes.bool,
    hideClose: PropTypes.bool,
    title: PropTypes.node,
    subTitle: PropTypes.node,
    desc: PropTypes.node.isRequired,
    hideTitle: PropTypes.bool,
};

