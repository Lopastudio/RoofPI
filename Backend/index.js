const express = require('express');
const { exec } = require('child_process');
//     const Gpio = require('onoff').Gpio;
const cors = require('cors');
const bodyParser = require('body-parser');
const dhtsensor = require('node-dht-sensor');
const fs = require('fs');
const { Client } = require('ssh2');

const settingsPath = './settings.json';

const app = express();
const port = 3010;

// Enable CORS
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


// Variables
var fanstatus = false;


app.get('/', (req, res) => {
    res.send('<h1 style="text-align: center;">RoofPi - Backend</h1><p style="text-align: center;">If you are looking for the RoofPi frontend, please visit the port 3000 instead of 3010.</p>');
});

app.get('/test', (req, res) => {
    res.send('This message comes from the Backend. Looks like it works :)');
});

app.get('/cputemp', (req, res) => {
    exec('/usr/bin/vcgencmd measure_temp', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            res.status(500).send('Internal Server Error');
            return;
        }
        const temperatureString = stdout.trim();
        const temperature = temperatureString.split('=')[1].split('\'')[0];
        res.send(temperature);
    });
});

app.get('/tempsensor', (req, res) => {
    dhtsensor.read(11, 17, function (err, temperature, humidity) {
        if (!err) {
            res.json({ temperature, humidity });
        } else {
            console.error(`Error: ${err}`);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.post("/fanctrl", (req, res) => {
    const { action } = req.body;
    //const pin = new Gpio(4, 'out');

    if (action === 'true') {
        //pin.writeSync(1);
        res.send('Fan on');
        fanstatus = true;
    } else if (action === 'false') {
        //pin.writeSync(0);
        res.send('Fan off');
        fanstatus = false;
    } else {
        res.status(400).send('Invalid action.');
    }
});

app.get("/fanstate", (req, res) => {
    res.send(fanstatus);
});

app.get('/settings/:key', (req, res) => {
    const { key } = req.params;
    fs.readFile(settingsPath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading settings file: ${err}`);
            res.status(500).send('Internal Server Error');
        } else {
            const settings = JSON.parse(data);
            if (settings.hasOwnProperty(key)) {
                res.json({ [key]: settings[key] });
            } else {
                res.status(404).send('Setting not found');
            }
        }
    });
});

app.post('/settings', (req, res) => {
    const newSettings = req.body; // Assuming the request body contains the new settings data

    fs.writeFile(settingsPath, JSON.stringify(newSettings), 'utf8', (err) => {
        if (err) {
            console.error(`Error writing settings file: ${err}`);
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).send('Settings updated successfully');
        }
    });
});

app.put('/settings', (req, res) => {
    const updatedSettings = req.body;

    fs.readFile(settingsPath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading settings file: ${err}`);
            res.status(500).send('Internal Server Error');
        } else {
            const settings = JSON.parse(data);
            const mergedSettings = { ...settings, ...updatedSettings };
            fs.writeFile(settingsPath, JSON.stringify(mergedSettings), 'utf8', err => {
                if (err) {
                    console.error(`Error writing settings file: ${err}`);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.status(200).send('Settings updated successfully');
                }
            });
        }
    });
});

app.delete('/settings', (req, res) => {
    fs.unlink(settingsPath, err => {
        if (err) {
            console.error(`Error deleting settings file: ${err}`);
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).send('Settings file deleted successfully');
        }
    });
});

app.post('/ssh', (req, res) => {
    const { host, port, username, password, command } = req.body;
  
    const sshCommand = `sshpass -p ${password} ssh -p ${port} ${username}@${host} ${command}`;
  
    exec(sshCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error}`);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.send(stdout);
    });
  });





const checkTemperatureAndControlFan = () => {
    dhtsensor.read(11, 17, function (err, temperature, humidity) {
        if (!err) {
            fs.readFile(settingsPath, 'utf8', (err, data) => {
                if (err) {
                    console.error(`Error reading settings file: ${err}`);
                    return;
                }

                const settings = JSON.parse(data);
                if (settings.hasOwnProperty('fanStartTemp') && settings.hasOwnProperty('fanStopTemp')) {
                    const fanStartTempSetting = settings.fanStartTemp;
                    const fanStopTempSetting = settings.fanStopTemp;
                    const fanStartHumSetting = settings.fanStartHumidity;
                    const fanStopHumSetting = settings.fanStopHumidity;


                    if (fanStartTempSetting.enabled && temperature >= fanStartTempSetting.value && !fanstatus) {
                        startFan();
                        fanstatus = true;
                    } else if (fanStopTempSetting.enabled && temperature <= fanStopTempSetting.value && fanstatus) {
                        stopFan();
                        fanstatus = false;
                    }

                    if (fanStartHumSetting.enabled && humidity >= fanStartHumSetting.value && !fanstatus) {
                        startFan();
                        fanstatus = true;
                    } else if (fanStopHumSetting.enabled && humidity <= fanStopHumSetting.value && fanstatus) {
                        stopFan();
                        fanstatus = false;
                    }
                }
            });
        } else {
            console.error(`Error: ${err}`);
        }
    });
};

// Check temperature and control fan every 5 seconds
setInterval(checkTemperatureAndControlFan, 5000);

//const pin = new Gpio(4, 'out');
const startFan = () => {
 //   pin.writeSync(1);
    fanstatus = true;
};

const stopFan = () => {
  //  pin.writeSync(0);
    fanstatus = false;
};






app.listen(port, () => {
    console.log(`App launched, running on port: ${port}`);
});
