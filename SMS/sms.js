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

            const latestLocationReceived = gpsd.lastSentLocation;

            let messageToSend = '';

            if (!latestLocationReceived) {
                messageToSend = 'No location has been recorded as of yet. Please try again later.'
            } else {
                messageToSend = 
                `See where your vehicle is on Google Maps: http:\/\/maps.google.com\/?q=${latestLocationReceived.lat.toString()},${latestLocationReceived.lon.toString()} \n\n` +
                `Last location received on ${new Date(Date.parse(latestLocationReceived.time)).toGMTString()}.`;
            }

            sendSms(phoneNumber, messageToSend);
        }
        else {
            log.info('SMS did not match any action. Replying with help...');
            sendSms(phoneNumber, 'Messsage did not match any action. Try saying \'Where is my car\'.');
        }

        log.info('Message sent.');

    } catch (errorMessage) {
        log.error(`An error occured when attempting to process sms action. ${errorMessage}`);
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