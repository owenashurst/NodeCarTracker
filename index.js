const gpsd = require('./gpsd');
const gpsService = require('./gps-service');
const https = require('./https');
const config = require('./config');
const dateTime = require('./date-time');
const smsWatcher = require('./sms/index');
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
            log.info('Processing latest GPS Data');
            await processLatestGpsData();
        }, 60000);
    } catch (error) {
        log.error(`Unhandled exception. Error: ${error.message} Stack: ${error.stack}`);
    }
}

const processLatestGpsData = async () => {
    try {
        const latestLocationData = gpsd.getLatestLocation();

        if (!latestLocationData) {
            log.info('No latest location data yet');
            return;
        }

        const hasMoved = gpsService.checkIfVehicleHasMoved();
        if (!hasMoved) {
            return;
        }

        // Add additional fields to object for dynamo
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
            catch (error) {
                retryCount++;

                log.error(`Error when uploading location. Retrying... ${retryCount}/${maxRetryCount} attempts`);

                await wait(5000);

                if (retryCount == maxRetryCount) {
                    log.error(`Retry count exceeded. Unable to upload location to server. Error: ${error.message} Stack: ${error.stack}`);
                    return;
                }
            }
        }

        log.info('Updating last sent location');
        gpsd.setLatestSentLocation(latestLocationData);
    }
    catch (error) {
        log.error(`Unable to upload location data to server. Error: ${error.message} Stack: ${error.stack}`)
    }
};

start();