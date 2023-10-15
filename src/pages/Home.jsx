import React, { useState } from 'react';
import './App.css';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  const [fanOn, setFanOn] = useState(false);

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
        alert("Error occured", error);
      });
  };

  return (
    <div>
      <div className="App">
        <div className="App-stuff">
          <h1>RoofPi</h1>
          <p>RPi Control System build for Pi's in inaccessible locations</p>
          <Form>
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Fan Control"
              checked={fanOn}
              onChange={handleFanToggle}
            />
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Home;