import React from 'react';

// Function to generate a random color
const getRandomColor = () => {
    const colors = [
        '#47b7ba80', '#3b81a9', '#a0ce4e','#4da7cc'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

// Avatar component to display the first letter of the username
const Avatar = ({ username }) => {
    const firstLetter = username ? username.charAt(0).toUpperCase() : '?'; // Get the first letter or '?' if no username
    const backgroundColor = getRandomColor(); // Random background color for the avatar

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%', // Makes it a circle
            backgroundColor: backgroundColor, // Assign the random background color
            color: '#fff', // Text color
            fontSize: '20px',
            fontWeight: 'bold',
            textAlign: 'center',
        }}>
            {firstLetter}
        </div>
    );
};

export default Avatar;
