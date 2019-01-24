const gpsd = require('./gpsd');
const log = require("./log");
const https = require("./https");
const mongoDb = require('./monogdb');

const start = async () => {
    try {
        gpsd.startLoggingGps();

        await mongoDb.init();

        setInterval(async () => {
            await init();
        }, 60000);
    } catch (message) {
        log.error(`Unhandled exception. ${message}`);
    }
}

const init = async () => {
    try {
        const latestLocationData = gpsd.getLatestLocation();
        if (latestLocationData === undefined) return;

        const hasMoved = gpsd.checkIfVehicleHasMoved();
        if (!hasMoved) return;

        await https.uploadLocationToServer(JSON.stringify(latestLocationData));

        await mongoDb.insertLatestLocationToDb(latestLocationData);

        gpsd.updateLatestSentLocation(latestLocationData);
        gpsd.clearLocationDataFromArray();
    }
    catch (message) {
        log.error(`Unable to upload location data to server. ${message}`)
    }
};

start();