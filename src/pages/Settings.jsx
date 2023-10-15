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
      settingName(e.target.checked);
    } else {
      settingName(e.target.value);
    }
  };

  const handleApply = async () => {
    try {
      await axios.put('http://localhost:3010/settings', {
        fanStartTemp,
        fanStopTemp,
        fanStartHumidity,
        fanStopHumidity,
        refreshInterval,
      });
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
              type="number"
              value={fanStartTemp.value}
              disabled={!fanStartTemp.enabled}
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
              type="number"
              value={fanStopTemp.value}
              disabled={!fanStopTemp.enabled}
              onChange={(e) => handleInputChange(e, setFanStopTemp, 'value')}
            />
          </div>
          <div>
            Fan start humidity:
            <input
              type="checkbox"
              checked={fanStartHumidity.enabled}
              onChange={(e) => handleInputChange(e, setFanStartHumidity, 'checkbox')}
            />
            <input
              type="number"
              value={fanStartHumidity.value}
              disabled={!fanStartHumidity.enabled}
              onChange={(e) => handleInputChange(e, setFanStartHumidity, 'value')}
            />
          </div>
          <div>
            Fan stop humidity:
            <input
              type="checkbox"
              checked={fanStopHumidity.enabled}
              onChange={(e) => handleInputChange(e, setFanStopHumidity, 'checkbox')}
            />
            <input
              type="number"
              value={fanStopHumidity.value}
              disabled={!fanStopHumidity.enabled}
              onChange={(e) => handleInputChange(e, setFanStopHumidity, 'value')}
            />
          </div>
          <br />
          <h4>ADVANCED (Change only if you know what you are doing!):</h4>
          <br />
          <div>
            Refresh interval:
            <input
              type="number"
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
