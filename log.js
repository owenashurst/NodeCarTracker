const dateTime = new Date();

logInfo = (message) => {
    console.info(`[INFO] ${dateTime} - ${message}`);
};

logError = (message) => {
    console.error(`[ERROR] ${dateTime} - ${message}`);
};

logDebug = (message) => {
    console.debug(`[DEBUG] ${dateTime} - ${message}`);
};

module.exports = {
    info: logInfo,
    error: logError,
    debug: logDebug
};