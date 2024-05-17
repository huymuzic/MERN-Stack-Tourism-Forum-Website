import React, { useEffect, useRef, useState } from 'react';

const FocusManager = ({ children, dropdownItems }) => {
    const containerRef = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                event.preventDefault();
                const current = document.activeElement;
                const suitableElement = findSuitableFocusTarget(current, event.key);
                if (suitableElement) {
                    if (suitableElement.tagName.toLowerCase() === 'button') {
                        const linkInsideButton = suitableElement.querySelector('a');
                        if (linkInsideButton) {
                            linkInsideButton.focus();
                            return;
                        }
                    }
                    suitableElement.focus();
                }
            }
        };

        const findSuitableFocusTarget = (element, direction) => {
            let currentElement = element;
            while (currentElement && currentElement !== document.body) {
                const focusableElements = findFocusableElements(currentElement, direction);
                if (focusableElements.length > 0) {
                    const bestFitElement = focusableElements.reduce((best, current) => {
                        return (calculateDistance(document.activeElement.getBoundingClientRect(), current.getBoundingClientRect()) <
                                calculateDistance(document.activeElement.getBoundingClientRect(), best.getBoundingClientRect())) ? current : best;
                    });
                    if (isValidTarget(document.activeElement.getBoundingClientRect(), bestFitElement.getBoundingClientRect(), direction)) {
                        return bestFitElement;
                    }
                }

                currentElement = currentElement.parentElement;
            }
            return null;
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
                return false;
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
            return Math.sqrt(dx * dx + dy * dy);
        };

        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleButtonFocus = () => {
        setDropdownOpen(true);
    };

    const handleBlur = (event) => {
        if (!containerRef.current.contains(event.relatedTarget)) {
            setDropdownOpen(false);
        }
    };

    return (
        <div ref={containerRef} tabIndex="-1" onBlur={handleBlur}>
            {React.Children.map(children, child =>
                React.cloneElement(child, { onFocus: handleButtonFocus })
            )}
            {dropdownOpen && (
                <ul className="dropdown-menu show">
                    {dropdownItems}
                </ul>
            )}
        </div>
    );
};

export default FocusManager;

