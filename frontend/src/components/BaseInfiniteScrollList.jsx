import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function BaseInfiniteScrollList({ list = [], loading, renderItem, totalPages, page, onChangePage, titleTotal, totalItems, renderEmpty, numberOfItemsPerRow }) {
    const observer = useRef();
    const lastItemRef = useRef();

    useEffect(() => {
        if (loading) return;

        const options = {
            root: null,
            rootMargin: '20px',
            threshold: 1.0
        };

        observer.current = new IntersectionObserver(handleObserver, options);
        if (lastItemRef.current) {
            observer.current.observe(lastItemRef.current);
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [loading]);

    const handleObserver = (entries) => {
        if (entries[0].isIntersecting && totalPages > page && !loading) {
            onChangePage(page + 1);
        }
    };

    return (
        <div style={{ overflowY: "auto" }}>
            <div className="container">
                {list.length === 0 && !loading && (
                    <div className="row">
                        <div className="col">
                            {renderEmpty ? renderEmpty() : <></>}
                        </div>
                    </div>
                )}
                <div className="row">
                    <div className="col">
                        {titleTotal && (
                            <div className="row mb-2">
                                <div className="col text-end">
                                    <span style={{ color: 'var(--primary-color)' }}>{titleTotal}: {totalItems || 0}</span>
                                </div>
                            </div>
                        )}
                        <div className="row">
                            {list.map((item, index) => {
                                const isLastItem = index === list.length - 1;
                                const ref = isLastItem ? lastItemRef : null;

                                return (
                                    <div className={`col-${12 / numberOfItemsPerRow}`} key={index} ref={ref}>
                                        {renderItem ? renderItem(item, index) : <></>}
                                    </div>
                                );
                            })}
                        </div>
                        {loading && (
                            <div className="row justify-content-center">
                                <div className="col-auto">
                                    <div className="spinner-border  text-warning mt-3" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

BaseInfiniteScrollList.propTypes = {
    list: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    renderItem: PropTypes.func,
    totalPages: PropTypes.number,
    page: PropTypes.number,
    onChangePage: PropTypes.func,
    titleTotal: PropTypes.string,
    totalItems: PropTypes.number,
    renderEmpty: PropTypes.func,
    numberOfItemsPerRow: PropTypes.number
};

export default BaseInfiniteScrollList;
