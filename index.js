const gpsd = require('./gpsd');
const log = require("./log");
const https = require("./https");
const mongoDb = require('./monogdb');
const config = require('./config');
const dateTime = require('./dateTime');

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

        if (!latestLocationData) return;

        const hasMoved = gpsd.checkIfVehicleHasMoved();
        if (!hasMoved) return;

        latestLocationData.expire = dateTime.generateTimeToLiveDateTime();
        latestLocationData.userId = config.userId;

        const maxRetryCount = 5;
        let retryCount = 0;
        while (retryCount <= maxRetryCount) {
            try {
                await https.uploadLocationToServer(JSON.stringify(latestLocationData));
                break;
            }
            catch (ex) {
                log.error(`Uploading location to server failed. Retrying... ${retryCount}/5 attempts`);

                if (retryCount == maxRetryCount) {
                    log.error(`Retry count exceeded. Unable to upload location to server. ${ex}`);
                    break;
                }

                retryCount++;
            }
        }

        await mongoDb.insertLatestLocationToDb(latestLocationData);

        gpsd.updateLatestSentLocation(latestLocationData);
        gpsd.clearLocationDataFromArray();
    }
    catch (message) {
        log.error(`Unable to upload location data to server. ${message}`)
    }
};

start();