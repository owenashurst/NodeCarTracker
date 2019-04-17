const config = require('./config');

const convertDateTimeToEpoch = (dateTime) => {
    return Math.floor(dateTime / 1000);
};

const generateTimeToLiveDateTime = () => {
    const dateTime = new Date().toLocaleString('en-GB', {
        timeZone: 'Europe/London'
    });

    dateTime.setDate(dateTime.getDate() + config.AwsDynamoTableRecordExpireInDays);
    
    return convertDateTimeToEpoch(dateTime);
};

module.exports = {
    generateTimeToLiveDateTime
};