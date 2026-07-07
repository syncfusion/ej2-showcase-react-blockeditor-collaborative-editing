import React from 'react';
import './ConnectionStatus.css';

interface ConnectionStatusProps {
    isConnected: boolean;
}

/**
 * Connection status indicator component
 */
export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
    return (
        <div className="connection-status">
            <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`} />
            <span className="status-text">
                {isConnected ? 'Connected' : 'Connecting...'}
            </span>
        </div>
    );
};
