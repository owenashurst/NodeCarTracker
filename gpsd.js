const log = require('./log');
const { spawn } = require('child_process');

let gpsLocationData = [];
let lastSentLocation = {};

const startLoggingGps = () => {
    try {
        const gpsPipe = spawn('gpspipe', ['-w'], {maxBuffer: 1024 * 500});
        gpsPipe.stdout.setEncoding('utf8');
        gpsPipe.stdout.on('data', (data) => {
            try {
                const gpsDataWithoutInvalidCharacters = data.substring(0, data.length - 1);
                const gpsData = parseGpsData(gpsDataWithoutInvalidCharacters);
               
		        if (gpsData.class &&
                    gpsData.class === 'TPV' && 
                    gpsData.lat && 
                    gpsData.lon && 
                    gpsData.time
                ) {
                    gpsLocationData.push(gpsData);
                }
            } catch(error) {}
        });
    } catch (error) {
      log.error(`Error when monitoring GPSPipe: Error: ${error.message} Stack: ${error.stack}`);
      throw error;
    }
}

const parseGpsData = (data) => {
    let gpsData;

    try {
        gpsData = JSON.parse(data);
    } catch (error) {
        gpsData = data;
    }

    return gpsData;
};

const getLastSentLocation = () => {
    return lastSentLocation;
};

const setLatestSentLocation = (latestLocationData) => {
    lastSentLocation = latestLocationData;
};

module.exports = {
    startLoggingGps,
    getLastSentLocation,
    setLatestSentLocation
};
