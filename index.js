const gpsd = require('./gpsd');
const gpsService = require('./gps-service');
const https = require('./https');
const config = require('./config');
const dateTime = require('./dateTime');
const smsWatcher = require('./SMS/index');
const log = require('./log');

const wait = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const start = async () => {
    try {
        log.info('Starting GPS Tracker...');
        gpsd.startLoggingGps();

        log.info('Starting SMS Watcher...');
        smsWatcher.initSmsWatcher();

        setInterval(async () => {
            await processLatestGpsData();
        }, 60000);
    } catch (error) {
        log.error(`Unhandled exception. Error: ${JSON.stringify(error)} Stack: ${error.stack}`);
    }
}

const processLatestGpsData = async () => {
    try {
        const latestLocationData = gpsd.getLatestLocation();

        if (!latestLocationData) return;

        const hasMoved = gpsService.checkIfVehicleHasMoved();
        if (!hasMoved) return;

        latestLocationData.expiry = dateTime.generateTimeToLiveDateTime();
        latestLocationData.userId = config.USER.USER_ID;

        const maxRetryCount = 5;
        let retryCount = 0;
        while (retryCount <= maxRetryCount) {
            try {
                const dataToUpload = JSON.stringify(latestLocationData);

                log.info('Uploading location to server');
                log.debug(dataToUpload);

                await https.uploadLocationToServer(dataToUpload);

                log.info('Successfully uploaded location to server');
                
                break;
            }
            catch (ex) {
                retryCount++;

                log.error(`Error when uploading location. Retrying... ${retryCount}/5 attempts`);

                await wait(5000);

                if (retryCount == maxRetryCount) {
                    log.error(`Retry count exceeded. Unable to upload location to server. ${ex}`);
                    return;
                }
            }
        }

        gpsd.updateLatestSentLocation(latestLocationData);
        gpsd.clearLocationData();
    }
    catch (message) {
        log.error(`Unable to upload location data to server. Error: ${JSON.stringify(error)} Stack: ${error.stack}`)
    }
};

start();