const fs = require('fs');

const parseSmsFile = (filename) => {
    return fs.readFileSync(filename, 'utf8').toLowerCase();
};

const parseFileNameAndGetPhoneNumber = (filename) => {
    return filename.split('_')[3].replace('+44', '0');
}

const doesSmsContainWord = (sms, word) => {
    return sms.indexOf(word.toLowerCase()) > -1;
};

module.exports = {
    parseSmsFile,
    parseFileNameAndGetPhoneNumber,
    doesSmsContainWord
};