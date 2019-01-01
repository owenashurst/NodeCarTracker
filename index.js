const gpsd = require('./gpsd');
const log = require("./log");
const https = require("./https");

try {
    gpsd.startLoggingGps();

    setInterval(async () => {
        await init();
    }, 60000);
} catch (message) {
    log.error(`Unhandled exception. ${message}`);
    return new Error(message);
}

const init = async () => {
    try {
        const latestLocationData = gpsd.getLatestLocation();
        if (latestLocationData === undefined) return;

        const hasMoved = gpsd.checkIfVehicleHasMoved();
        if (!hasMoved) return;

        await https.uploadLocationToServer(JSON.stringify(latestLocationData));
        await https.retryFailedUploads();

        gpsd.updateLatestSentLocation(latestLocationData);
        gpsd.clearLocationDataFromArray();
    }
    catch (message) {
        log.error(`Unable to upload location data to server. ${message}`)
    }
};