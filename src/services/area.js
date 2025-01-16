import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchAreas = async () => {
    try {
        const response = await fetch(`${BASE_URL}/Area/all-areas`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching areas:', error);
        throw error; // Rethrow the error for handling in the calling function
    }
};