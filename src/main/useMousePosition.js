import React from 'react';
export default function useMousePosition() {
    const [
        mousePosition,
        setMousePosition
    ] = React.useState({ x: null, y: null });

    React.useEffect(() => {
        const updateMousePosition = ev => {
            setMousePosition({ x: ev.clientX, y: ev.clientY });
        };
        window.addEventListener('mousemove', updateMousePosition);
        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
        };
    }, []);
    return mousePosition;
};