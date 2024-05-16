import PropTypes from 'prop-types';
import CustomPagination from './CustomPagination';
import { useTheme } from '../theme/Theme';
import CircularProgress from './CircularProgress';


function BasePaginationList({ list = [], loading, renderItem, totalPages, page, onChangePage, titleTotal, totalItems, renderEmpty }) {
    const { color } = useTheme()
    return (
        <div style={{ overflowY: "auto" }}>
            <div className="container">
                {loading ? (
                    <div className="row justify-content-center" >
                        <div className="col-auto">
                            <CircularProgress />
                        </div>
                    </div>
                ) : !list.length ? (
                    <div className="row">
                        <div className="col">
                            {renderEmpty ? renderEmpty() : <></>}
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col">
                            {titleTotal && (
                                <div className="row mb-2">
                                    <div className="col text-end">
                                        <span style={{ color: color.primary }}>{titleTotal}: {totalItems || 0}</span>
                                    </div>
                                </div>
                            )}
                            <div className="row">
                                {list.map((item, index) => (
                                    <div className="col-12 col-sm-12 col-md-12 col-xl-12" key={index}>
                                        {renderItem ? renderItem(item) : <></>}
                                    </div>
                                ))}
                            </div>
                            {totalPages && totalPages > 1 && (
                                <div className="row mt-3">
                                    <div className="col">
                                        <CustomPagination
                                            totalPages={totalPages}
                                            currentPage={page}
                                            onChange={onChangePage}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
BasePaginationList.propTypes = {
    list: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    renderItem: PropTypes.func,
    totalPages: PropTypes.number,
    page: PropTypes.number,
    onChangePage: PropTypes.func,
    titleTotal: PropTypes.string,
    totalItems: PropTypes.number,
    renderEmpty: PropTypes.func
};
export default BasePaginationList;
