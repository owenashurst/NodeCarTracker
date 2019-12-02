require('dotenv').config();

module.exports = {
    AWS: {
        API_URL: process.env.API_URL || 'jpc905lswi.execute-api.eu-west-1.amazonaws.com',
        API_ENDPOINT: process.env.API_ENDPOINT || '/live/location',
        AWS_DB_EXPIRY: process.env.AWS_DB_EXPIRY || 5
    },
    SMS: {
        SMS_INBOX_DIRECTORY: '/home/pi/sms/inbox'
    },
    USER: {
        USER_ID: process.env.USER_ID || ''
    }
};