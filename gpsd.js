const gpsd = require("node-gpsd");
const log = require("./log");
const config = require('./config');

let gpsLocationData = [];
let lastSentLocation = {};

startLoggingGpsAndPostLocationToServer = () => {
    try {
        const daemon = new gpsd.Daemon({
        program: "gpsd",
        device: config.GpsDevice,
        port: 2947,
        pid: "/tmp/gpsd.pid",
        readOnly: false,
        logger: {
            info: () => {},
            warn: console.warn,
            error: console.error
        }
        });
        daemon.start(() => {
        log.info("Daemon Started.");
        });
    } catch (message) {
      log.error(message);
      throw new Error(`Unable to start daemon. ${message}`);
    }

    try {
        const listener = new gpsd.Listener({
            port: 2947,
            hostname: "localhost",
            logger: {
            info: function() {},
            warn: console.warn,
            error: console.error
            },
            parse: true
        });
        listener.connect(() => {
            log.info("Listener Connected.");
        });
        listener.watch();
        listener.on("TPV", gpsData => {
            gpsLocationData.push(gpsData);
        });
    } catch (message) {
        log.error(message);
        throw new Error(`Unable to start listener. ${message}`);
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

updateLatestSentLocation = (latestLocationData) => {
    lastSentLocation = latestLocationData;
};

clearLocationDataFromArray = () => {
    gpsLocationData = [];  
};

module.exports = {
  startLoggingGpsAndPostLocationToServer,
  checkIfVehicleHasMoved,
  getLatestLocation,
  clearLocationDataFromArray,
  updateLatestSentLocation,
  gpsLocationData,
  lastSentLocation
};
