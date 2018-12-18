const https = require('https');
const log = require("./log");
const config = require('./config');

uploadLocationToServer = (dataToPost) => {
    const postOptions = {
        host: config.ApiUrl,
        path: config.ApiUrlEndpoint,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": config.AwsApiGatewayApiKey
        }
    };

    try {
        log.info('Posting location to server...');
        log.debug(dataToPost);

        const httpRequest = https.request(postOptions, (res) => {
            let responseString = '';
        
            res.on('data', function (data) {
                responseString += data;
            });

            res.on('end', function () {
                return responseString;
            });
        });

        httpRequest.write(dataToPost);
        httpRequest.end();
    } catch (message) {
        log.error(`Unable to post data to server. ${message}`);
        throw new Error(message);
    }
};

module.exports = {
    uploadLocationToServer
};