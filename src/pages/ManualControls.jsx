import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./ManualControls.css";

function ManualControls() {

  const [fanOn, setFanOn] = useState(null); // Initialize with null initially

  useEffect(() => {
    axios.get('http://localhost:3010/fanstate')
      .then(response => {
        setFanOn(response.data); // Assuming the response is a boolean value
      })
      .catch(error => {
        console.error('An error occurred', error);
      });
  }, []);

  const handleFanToggle = () => {
    const newFanState = !fanOn;
    setFanOn(newFanState);

    // Make a POST request to the backend to control the fan
    axios.post('http://localhost:3010/fanctrl', { action: newFanState.toString() })
      .then(response => {
        //console.log('Response:', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
        alert("Error occurred", error);
      });
  };

  if (fanOn === null) {
    return <div>Waiting for the backend...</div>;
  }

  return (
    <div className="Appenos">
      <h1>Manual Controls</h1>
      <div>
        <label htmlFor="fan-control" className="control-label">Fan Control: </label>
        <input
          type="checkbox"
          id="fan-control"
          checked={fanOn}
          onChange={handleFanToggle}
        />
      </div>
    </div>
  );
}

export default ManualControls;
