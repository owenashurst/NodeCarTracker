const config = require('./config');

const convertDateTimeToEpoch = (dateTime) => {
    return Math.floor(dateTime / 1000);
};

const generateTimeToLiveDateTime = () => {
    const dateTime = new Date();
    dateTime.setDate(dateTime.getDate() + config.AWS.AWS_DB_EXPIRY);
    
    return parseInt(convertDateTimeToEpoch(dateTime));
};

module.exports = {
    generateTimeToLiveDateTime
};