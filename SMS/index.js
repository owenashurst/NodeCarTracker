const watcher = require('./watcher');
const log = require('../log');

const initSmsWatcher = async () => {
    try {
        await watcher.startSmsInboxWatcher();
    } catch (error) {
        log.error(`Unhandled error. Error: ${error.message} Stack: ${error.stack}`);
    }
};

module.exports = {
    initSmsWatcher
};