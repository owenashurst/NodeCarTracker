logInfo = (message) => {
	const dateTime = new Date();
    console.info(`[INFO] ${dateTime} - ${message}`);
};

logError = (message) => {
	const dateTime = new Date();
    console.error(`[ERROR] ${dateTime} - ${message}`);
};

logDebug = (message) => {
	const dateTime = new Date();
    console.debug(`[DEBUG] ${dateTime} - ${message}`);
};

module.exports = {
    info: logInfo,
    error: logError,
    debug: logDebug
};