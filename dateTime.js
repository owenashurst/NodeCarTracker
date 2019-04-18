const config = require('./config');

const convertDateTimeToEpoch = (dateTime) => {
    return Math.floor(dateTime / 1000);
};

const generateTimeToLiveDateTime = () => {
    const dateTime = new Date();
    dateTime.setDate(dateTime.getDate() + 5);
    const dateTimeInUtc = dateTime.getTime() - (dateTime.getTimezoneOffset() * 60 * 1000);

    return convertDateTimeToEpoch(dateTimeInUtc);
};

module.exports = {
    generateTimeToLiveDateTime
};