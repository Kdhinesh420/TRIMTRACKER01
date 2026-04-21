import React from 'react';

/**
 * Reusable Button component!
 * This helps us have consistent styles across our app.
 */
const Button = ({ text, onClick, color = '#4CAF50' }) => {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '10px 20px',
                backgroundColor: color,
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
            }}
        >
            {text}
        </button>
    );
};

export default Button;
