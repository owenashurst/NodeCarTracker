const config = require('./config');

const convertDateTimeToEpoch = (dateTime) => {
    return Math.floor(dateTime / 1000);
};

const generateTimeToLiveDateTime = () => {
    const dateTime = new Date();
    const dateTimeInUtc = dateTime.getTime() - (dateTime.getTimezoneOffset() * 60 * 1000);
    dateTimeInUtc.setDate(dateTimeInUtc.getDate() + config.AwsDynamoTableRecordExpireInDays);
    
    return convertDateTimeToEpoch(dateTimeInUtc);
};

module.exports = {
    generateTimeToLiveDateTime
};