import React, { useState, useEffect } from 'react';

const ErrorAlert = ({ message, show }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            // Hide the alert after 3 seconds
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [show]);

    return (
        <div className={`error-alert alert  ${isVisible ? 'show' : 'hide'}`}>
            {message}
        </div>
    );
};

export default ErrorAlert;
