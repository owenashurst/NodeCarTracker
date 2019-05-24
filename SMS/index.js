const watcher = require('./watcher');
const log = require('../log');

const initSmsWatcher = async () => {
    try {
        log.info('Starting SMS Watcher...');
        await watcher.startSmsInboxWatcher();
    } catch (error) {
        log.error(`Unhandled error. ${error}`);
    }
};

module.exports = {
    initSmsWatcher
};