import React from 'react';
import './Hero.css';

/**
 * Hero section with heading, subheading, and demo intro
 */
export const Hero: React.FC = () => {
    return (
        <section className="hero">
            <div className="hero-container">
                <h1 className="hero-title">Real-time Collaborative Block Editor</h1>
                <p className="hero-subtitle">
                    Collaborate effortlessly with multiple users in real time using the Syncfusion Block Editor.
                </p>
            </div>
        </section>
    );
};
