import React, { useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';

const FocusManager = ({ children }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                event.preventDefault();
                moveFocus(event.key);
            }
        };

        const moveFocus = (direction) => {
            // First focus within the current container
            const current = document.activeElement;
            const isInsideContainer = containerRef.current.contains(current);
            if (!isInsideContainer) return; // Focus is not within the container, do nothing

            const focusable = Array.from(containerRef.current.querySelectorAll(
                'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
            ));

            const targetElement = findClosestFocusable(focusable, current, direction);
            if (targetElement) {
                targetElement.focus();
            } else {
                // If no element was found, allow focus to potentially move out of the container
                // This could be enhanced to direct focus specifically to headers, footers, or other navigational components
                let allFocusable = Array.from(document.querySelectorAll(
                    'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
                ));
                allFocusable = allFocusable.filter(el => containerRef.current !== el && !containerRef.current.contains(el));
                const externalTarget = findClosestFocusable(allFocusable, current, direction);
                externalTarget?.focus();
            }
        };

        const findClosestFocusable = (elements, current, direction) => {
            const currentRect = current.getBoundingClientRect();
            let bestElement = null;
            let minDistance = Infinity;

            for (const element of elements) {
                if (element === current) continue;
                const rect = element.getBoundingClientRect();
                if (isValidTarget(currentRect, rect, direction)) {
                    const distance = calculateDistance(currentRect, rect);
                    if (distance < minDistance) {
                        minDistance = distance;
                        bestElement = element;
                    }
                }
            }
            console.log(bestElement)
            return bestElement;
        };

        const isValidTarget = (currentRect, targetRect, direction) => {
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

        const calculateDistance = (fromRect, toRect) => {
            const dx = toRect.left - fromRect.left;
            const dy = toRect.top - fromRect.top;
            return Math.sqrt(dx * dx + dy * dy);  // Euclidean distance
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

