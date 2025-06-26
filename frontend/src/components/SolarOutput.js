import React, { useState, useEffect } from 'react';

const SolarOutput = () => {
    const [predictions, setPredictions] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/solar-output')
            .then((response) => response.json())
            .then((data) => setPredictions(data))
            .catch((error) => console.error('Error fetching solar output:', error));
    }, []);

    return (
        <div>
            <h2>Solar Output Predictions</h2>
            <ul>
                {predictions.map((prediction, index) => (
                    <li key={index}>
                        Date: {prediction.date}, Predicted Output: {prediction.predicted_output_kwh} kWh
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SolarOutput; 