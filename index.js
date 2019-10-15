const gpsd = require('./gpsd');
const log = require("./log");
const https = require("./https");
const config = require('./config');
const dateTime = require('./dateTime');
const smsWatcher = require('./sms/index');

const wait = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const start = async () => {
    try {
        log.info('Starting GPS Tracker...');
        gpsd.startLoggingGps();

        smsWatcher.initSmsWatcher();

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

        latestLocationData.expiry = dateTime.generateTimeToLiveDateTime();
        latestLocationData.userId = config.userId;

        const maxRetryCount = 5;
        let retryCount = 0;
        while (retryCount <= maxRetryCount) {
            try {
                await https.uploadLocationToServer(JSON.stringify(latestLocationData));
                break;
            }
            catch (ex) {
                log.error(`Error when uploading location. Retrying... ${retryCount}/5 attempts`);

                await wait(5000);

                if (retryCount == maxRetryCount) {
                    log.error(`Retry count exceeded. Unable to upload location to server. ${ex}`);
                    break;
                }

                retryCount++;
            }
        }

        gpsd.updateLatestSentLocation(latestLocationData);
        gpsd.clearLocationData();
    }
    catch (message) {
        log.error(`Unable to upload location data to server. ${message}`)
    }
};

start();