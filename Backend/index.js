const express = require('express');
const { exec } = require('child_process');
const Gpio = require('onoff').Gpio;
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3010;

// Enable CORS
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('<h1 style="text-align: center;">RoofPi - Backend</h1><p style="text-align: center;">If you are looking for the RoofPi frontend, please visit the port 3000 instead of 3010.</p>');
});

app.get('/test', (req, res) => {
    res.send('This message comes from the Backend. Looks like it works :)');
});

app.get('/temp', (req, res) => {
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

app.post("/fanctrl", (req, res) => {
    const { action } = req.body;
    const pin = new Gpio(4, 'out');

    if (action === 'true') {
        pin.writeSync(1);
        res.send('Fan on');
    } else if (action === 'false') {
        pin.writeSync(0);
        res.send('Fan off');
    } else {
        res.status(400).send('Invalid action.');
    }
});

app.listen(port, () => {
    console.log(`App launched, running on port: ${port}`);
});
