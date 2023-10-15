import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function Home() {
    const [sensorData, setSensorData] = useState({ temperature: null, humidity: null, CPUtemp: null });
    const [updateFrequency, setUpdateFrequency] = useState(4000);

    useEffect(() => {
        fetchUpdateFrequency();
        fetchSensorData();
        fetchCPUTemp();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchSensorData();
            fetchCPUTemp();
        }, updateFrequency);

        return () => clearInterval(interval);
    }, [updateFrequency]);

    const fetchUpdateFrequency = () => {
        axios.get('http://localhost:3010/settings/tempChangeInterval')
            .then(response => {
                setUpdateFrequency(response.data.tempChangeInterval);
            })
            .catch(error => {
                console.error('Error fetching update frequency:', error);
            });
    };

    const fetchCPUTemp = () => {
        axios.get('http://localhost:3010/cputemp')
            .then(response => {
                const cpuTemp = parseFloat(response.data);
                setSensorData(prevState => ({ ...prevState, CPUtemp: cpuTemp }));
            })
            .catch(error => {
                console.error('Error fetching CPU temperature:', error);
            });
    };

    const fetchSensorData = () => {
        axios.get('http://localhost:3010/tempsensor')
            .then(response => {
                const { temperature, humidity } = response.data;
                setSensorData(prevState => ({ ...prevState, temperature, humidity }));
            })
            .catch(error => {
                console.error('Error fetching sensor data:', error);
            });
    };

    return (
        <div>
            <div className="App">
                <div className="App-stuff">
                    <h1>RoofPi</h1>
                    <p>RPi Control System built for Pi's in inaccessible locations</p>
                    {sensorData.temperature && sensorData.humidity && sensorData.CPUtemp !== null && (
                        <div>
                            <p>CPU Temperature 🌡️: {sensorData.CPUtemp}°C</p>
                            <p>Temperature🌡️: {sensorData.temperature}°C</p>
                            <p>Humidity 😓: {sensorData.humidity}%</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
