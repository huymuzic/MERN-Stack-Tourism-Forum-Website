import React, { useEffect, useRef } from 'react';

const FocusManager = ({ children }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                event.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt
                const current = document.activeElement;
                const suitableElement = findSuitableFocusTarget(current, event.key);

                if (suitableElement) {
                    suitableElement.focus();
                }
            }
        };
        const findSuitableFocusTarget = (element, direction) => {
            let currentElement = element;
            while (currentElement && currentElement !== document.body) {
                const focusableElements = findFocusableElements(currentElement, direction);
                console.log("🚀 ~ findSuitableFocusTarget ~ focusableElements:", focusableElements)
                // Nếu tìm thấy các phần tử tiềm năng trong container hiện tại, kiểm tra từng cái một
                if (focusableElements.length > 0) {
                    // Sử dụng phương thức reduce để tìm ra phần tử thích hợp nhất
                    const bestFitElement = focusableElements.reduce((best, current) => {
                        return (calculateDistance(document.activeElement.getBoundingClientRect(), current.getBoundingClientRect()) <
                                calculateDistance(document.activeElement.getBoundingClientRect(), best.getBoundingClientRect())) ? current : best;
                    });
                    console.log("🚀 ~ bestFitElement ~ bestFitElement:", bestFitElement.getBoundingClientRect())
        
                    // Kiểm tra xem phần tử tốt nhất có thực sự thỏa mãn yêu cầu không
                    if (isValidTarget(document.activeElement.getBoundingClientRect(), bestFitElement.getBoundingClientRect(), direction)) {
                        return bestFitElement; // Trả về phần tử thích hợp nếu thỏa mãn
                    }
                }
                // Tiếp tục tìm kiếm trong container cha nếu không tìm thấy phần tử thỏa mãn
                currentElement = currentElement.parentElement;
            }
            return null; // Trả về null nếu không tìm thấy phần tử thỏa mãn trong bất kỳ container nào
        };
        
        const findFocusableElements = (container, direction) => {
            const focusable = Array.from(container.querySelectorAll(
                'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
            ));
            return focusable.filter(el => isValidTarget(document.activeElement.getBoundingClientRect(), el.getBoundingClientRect(), direction))
                            .sort((a, b) => compareDistance(document.activeElement, a, b, direction));
        };

        const isValidTarget = (currentRect, targetRect, direction) => {
            if (targetRect.width === 0 && targetRect.height === 0) {
                return false; // Skip this element if it has zero width and height
            }        
            switch (direction) {
                case 'ArrowUp':
                    return targetRect.bottom <= currentRect.top;
                case 'ArrowDown':
                    return targetRect.top >= currentRect.bottom;
                case 'ArrowLeft':
                    return targetRect.right <= currentRect.left;
                case 'ArrowRight':
                    return targetRect.left >= currentRect.right;
                default:
                    return false;
            }
        };

        const compareDistance = (current, a, b, direction) => {
            const rectA = a.getBoundingClientRect();
            const rectB = b.getBoundingClientRect();
            return calculateDistance(current.getBoundingClientRect(), rectA) - calculateDistance(current.getBoundingClientRect(), rectB);
        };

        const calculateDistance = (fromRect, toRect) => {
            const dx = (toRect.left + toRect.right) / 2 - (fromRect.left + fromRect.right) / 2;
            const dy = (toRect.top + toRect.bottom) / 2 - (fromRect.top + fromRect.bottom) / 2;
            return Math.sqrt(dx * dx + dy * dy); // Khoảng cách Euclidean
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div ref={containerRef} tabIndex="-1">
            {children}
        </div>
    );
};

export default FocusManager;
