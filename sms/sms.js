const exec = require('child_process').exec;
const log = require('../log');
const fs = require('fs');
const smsParser = require('./smsParser');
const gpsd = require('../gpsd');

const processNewSms = async (filename) => {
    const phoneNumber = smsParser.parseFileNameAndGetPhoneNumber(filename);

    log.info(`Message received from ${phoneNumber}`);

    const smsMessage = smsParser.parseSmsFile(filename);
    await processSmsAction(phoneNumber, smsMessage);

    log.info('Deleting received message...');
    deleteReceivedSms(filename);
}

const processSmsAction = async (phoneNumber, smsMessage) => {
    if (!smsMessage) return;

    try {
        if ((smsParser.doesSmsContainWord(smsMessage, 'where\'s') || smsParser.doesSmsContainWord(smsMessage, 'where')) && 
            (smsParser.doesSmsContainWord(smsMessage, 'car') || smsParser.doesSmsContainWord(smsMessage, 'location'))) {

            log.info('Car location requested. Replying...');

            const latestLocation = gpsd.getLastSentLocation();

            let messageToSend = '';

            if (Object.keys(latestLocation).length === 0) {
                messageToSend = 'No location has been recorded as of yet. Please try again later.'
            } else {
                messageToSend = 
                `See where your vehicle is on Google Maps: http:\/\/maps.google.com\/?q=${latestLocation.lat.toString()},${latestLocation.lon.toString()} \n\n` +
                `Last location received on ${new Date(Date.parse(latestLocation.time)).toGMTString()}.`;
            }

            sendSms(phoneNumber, messageToSend);
        }
        else {
            log.info('SMS did not match any action. Replying with help...');
            sendSms(phoneNumber, 'Messsage did not match any action. Try saying \'Where is my car\'.');
        }

    } catch (error) {
        log.error(`Error when attempting to process sms action. Error: ${error.message} Stack: ${error.stack}`);
    }
}

const sendSms = (phoneNumber, message) => {
    exec(`sudo gammu-smsd-inject TEXT ${phoneNumber} -text "${message}"`, function (error, stdout, stderr) {
        log.info(`Sending reply to ${phoneNumber}...`);
        if (error !== null) {
            log.error(`Unable to send SMS. ${error}`);
        }
    });
}

const deleteReceivedSms = (filename) => {
    if (fs.existsSync(filename)) {
        fs.unlinkSync(filename);
    }
}

module.exports = {
    processNewSms
}