const log = require('./log');
const { spawn } = require('child_process');

let gpsLocationData = [];
let lastSentLocation = {};

const startLoggingGps = () => {
    try {
        const gpsPipe = spawn('gpspipe', ['-w'], {maxBuffer: 1024 * 500});
        gpsPipe.stdout.setEncoding('utf8');
        gpsPipe.stdout.on('data', (gpsData) => {
            try {
                const data = JSON.parse(gpsData);
                if (data.class === 'TPV' && 
                    data.lat && 
                    data.lon && 
                    data.speed && 
                    data.climb && 
                    data.alt && 
                    data.time
                ) {
                    gpsLocationData.push(data);
                }
            } catch(error) {
                log.error(`Error in data. Error: ${error.message} Stack: ${error.stack}`);
            }
        });
    } catch (error) {
      log.error(`Error when monitoring GPSPipe: Error: ${error.message} Stack: ${error.stack}`);
      throw error;
    }
}

const getLatestLocation = () => {
    if (gpsLocationData.length === 0) return;

    return gpsLocationData[gpsLocationData.length - 1];
};

const getLastSentLocation = () => {
    return lastSentLocation;
};

const updateLatestSentLocation = (latestLocationData) => {
    log.info('Updating last sent location');
    lastSentLocation = latestLocationData;
};

const clearLocationData = () => {
    gpsLocationData = [];  
};

module.exports = {
    startLoggingGps,
    getLatestLocation,
    getLastSentLocation,
    clearLocationData,
    updateLatestSentLocation
};
