import React, { useEffect, useRef } from 'react';
import {
    createSpinner,
    showSpinner,
    hideSpinner
} from '@syncfusion/ej2-popups';

interface LoadingSpinnerProps {
    text?: string;
}

export const LoadingSpinner: React.FC<
    LoadingSpinnerProps
> = ({
    text = 'Initializing collaboration...'
}) => {

    const spinnerRef =
        useRef<HTMLDivElement>(null);

    useEffect(() => {

        if (!spinnerRef.current) {
            return;
        }

        createSpinner({
            target: spinnerRef.current
        });

        showSpinner(spinnerRef.current);

        return () => {
            hideSpinner(spinnerRef.current!);
        };

    }, []);

    return (
        <div className="loading-container">

            <div
                ref={spinnerRef}
                className="spinner-host"
            />

            <p className="loading-text">
                {text}
            </p>

        </div>
    );
};