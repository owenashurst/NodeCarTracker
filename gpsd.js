const log = require("./log");
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
                if (data.class === 'TPV') {
                    gpsLocationData.push(data);
                }
            } catch(error){}
        });
    } catch (error) {
      log.error(error);
      throw new Error(`Unable to start gpspipe or parse data: ${error}`);
    }
}

const checkIfVehicleHasMoved = () => {
    try {
        if (Object.keys(lastSentLocation).length === 0) return true;

        const latestLocation = getLatestLocation();

        const latestLongitudeLocationNearest = Math.floor(latestLocation.lon * 10000);
        const lastSentLongitudeLocationNearest = Math.floor(lastSentLocation.lon * 10000);
        const hasLongitudeDiffered = latestLongitudeLocationNearest !== lastSentLongitudeLocationNearest;

        log.debug(`Last sent longitude: ${lastSentLongitudeLocationNearest} | Latest longitude: ${latestLongitudeLocationNearest}`)

        const latestLatitudeLocationNearest = Math.floor(latestLocation.lat * 10000);
        const lastSentLatitudeLocationNearest = Math.floor(lastSentLocation.lat * 10000);
        const hasLatitudeDiffered = latestLatitudeLocationNearest !== lastSentLatitudeLocationNearest;

        log.debug(`Last sent latitude: ${lastSentLatitudeLocationNearest} | Latest latitude: ${latestLatitudeLocationNearest}`)

        log.info(`Vehicle moved: ${hasLongitudeDiffered && hasLatitudeDiffered}`);
        
        return hasLongitudeDiffered && hasLatitudeDiffered;
    }
    catch (message) {
        log.error(`Unable to determine if vehicle has moved. ${message}`);
        throw new Error(message);
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
    checkIfVehicleHasMoved,
    getLatestLocation,
    getLastSentLocation,
    clearLocationData,
    updateLatestSentLocation
};
