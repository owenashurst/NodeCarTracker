const gpsd = require('./gpsd');
const log = require('./log');

const checkIfVehicleHasMoved = () => {
    try {
        const lastSentLocation = gpsd.getLastSentLocation();
        if (Object.keys(lastSentLocation).length === 0) {
            log.info('No data for last sent location');
            return true;
        }

        const latestLocation = gpsd.getLatestLocation();

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
    catch (error) {
        log.error(`Eror when determining if vehicle has moved. ${error}`);
        throw error;
    }
}

module.exports = {
    checkIfVehicleHasMoved
};