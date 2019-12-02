const chokidar = require('chokidar');
const config = require('../config');
const sms = require('./sms');

const startSmsInboxWatcher = async () => {
    const watcher = chokidar.watch(`${config.SMS.SMS_INBOX_DIRECTORY}`, {ignored: /^\./, persistent: true});
    watcher.on('add', async (path) => {
        await sms.processNewSms(path);
    });
}

module.exports = {
    startSmsInboxWatcher
}