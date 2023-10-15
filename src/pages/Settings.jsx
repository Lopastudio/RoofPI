import React, { useState, useEffect } from 'react';
import "./Settings.css";
import axios from 'axios';

function Settings() {
  const [fanStartTemp, setFanStartTemp] = useState({ enabled: false, value: 0 });
  const [fanStopTemp, setFanStopTemp] = useState({ enabled: false, value: 0 });
  const [fanStartHumidity, setFanStartHumidity] = useState({ enabled: false, value: 0 });
  const [fanStopHumidity, setFanStopHumidity] = useState({ enabled: false, value: 0 });
  const [refreshInterval, setRefreshInterval] = useState(0);

  useEffect(() => {
    const fetchData = async (key) => {
      try {
        const response = await axios.get(`http://localhost:3010/settings/${key}`);
        const data = response.data[key];
        if (data !== null) {
          if (key === 'fanStartTemp') setFanStartTemp(data);
          else if (key === 'fanStopTemp') setFanStopTemp(data);
          else if (key === 'fanStartHumidity') setFanStartHumidity(data);
          else if (key === 'fanStopHumidity') setFanStopHumidity(data);
          else if (key === 'refreshInterval') setRefreshInterval(data);
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
  
    fetchData('fanStartTemp');
    fetchData('fanStopTemp');
    fetchData('fanStartHumidity');
    fetchData('fanStopHumidity');
    fetchData('refreshInterval');
  }, []);

  const handleInputChange = (e, settingName, valueType) => {
    if (valueType === 'checkbox') {
      settingName(prevState => ({
        ...prevState,
        enabled: e.target.checked
      }));
    } else {
      const newValue = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
      settingName(prevState => ({
        ...prevState,
        value: newValue
      }));
    }
  };
  

  const handleApply = async () => {
    try {
      const formattedData = {
        fanStartTemp: {
          enabled: fanStartTemp.enabled,
          value: fanStartTemp.value ? fanStartTemp.value.toString() : "0" // Check if value exists
        },
        fanStopTemp: {
          enabled: fanStopTemp.enabled,
          value: fanStopTemp.value ? fanStopTemp.value.toString() : "0" // Check if value exists
        },
        fanStartHumidity: {
          enabled: fanStartHumidity.enabled,
          value: fanStartHumidity.value ? fanStartHumidity.value.toString() : "0" // Check if value exists
        },
        fanStopHumidity: {
          enabled: fanStopHumidity.enabled,
          value: fanStopHumidity.value ? fanStopHumidity.value.toString() : "0" // Check if value exists
        },
        refreshInterval: refreshInterval.toString() // Convert to string
      };

      await axios.put('http://localhost:3010/settings', formattedData);
      alert('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings', error);
    }
  };

  return (
    <div className="Appenos">
      <h1>Settings</h1>
      <div>
        <br />
        <h4>Fan start/stop:</h4>
        <br />
        <div>
          <div>
            Fan start temp:
            <input
              type="checkbox"
              checked={fanStartTemp.enabled}
              onChange={(e) => handleInputChange(e, setFanStartTemp, 'checkbox')}
            />
            <input
              type="text"
              value={fanStartTemp.value}
              disabled={!fanStartTemp.enabled || fanStartTemp.value === null}
              onChange={(e) => handleInputChange(e, setFanStartTemp, 'value')}
            />
          </div>
          <div>
            Fan stop temp:
            <input
              type="checkbox"
              checked={fanStopTemp.enabled}
              onChange={(e) => handleInputChange(e, setFanStopTemp, 'checkbox')}
            />
            <input
              type="text"
              value={fanStopTemp.value}
              disabled={!fanStopTemp.enabled || fanStopTemp.value === null}
              onChange={(e) => handleInputChange(e, setFanStopTemp, 'value')}
            />
          </div>
          <div>
            Fan start humidity (Work In Progress!):
            <input
              type="checkbox"
              checked={fanStartHumidity.enabled}
              onChange={(e) => handleInputChange(e, setFanStartHumidity, 'checkbox')}
            />
            <input
              type="text"
              value={fanStartHumidity.value}
              disabled={!fanStartHumidity.enabled || fanStartHumidity.value === null}
              onChange={(e) => handleInputChange(e, setFanStartHumidity, 'value')}
            />
          </div>
          <div>
            Fan stop humidity  (Work In Progress!):
            <input
              type="checkbox"
              checked={fanStopHumidity.enabled}
              onChange={(e) => handleInputChange(e, setFanStopHumidity, 'checkbox')}
            />
            <input
              type="text"
              value={fanStopHumidity.value}
              disabled={!fanStopHumidity.enabled || fanStopHumidity.value === null}
              onChange={(e) => handleInputChange(e, setFanStopHumidity, 'value')}
            />
          </div>
          <br />
          <h4>ADVANCED (Change only if you know what you are doing!):</h4>
          <br />
          <div>
            Refresh interval:
            <input
              type="text"
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(e.target.value)}
            />
          </div>
          <button onClick={handleApply}>Apply</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;