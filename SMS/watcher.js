const chokidar = require('chokidar');
const config = require('./config');
const sms = require('./sms');

const startSmsInboxWatcher = async () => {
    const watcher = chokidar.watch(`${config.smsInboxDirectory}`, {ignored: /^\./, persistent: true});
    watcher.on('add', async (path) => {
        await sms.processNewSms(path);
    });
}

module.exports = {
    startSmsInboxWatcher
}