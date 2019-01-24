const https = require('https');
const log = require("./log");
const config = require('./config');

const uploadLocationToServer = async (dataToPost) => {
    const postOptions = {
        host: config.AwsApiUrl,
        path: config.AwsApiUrlEndpoint,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": config.AwsApiGatewayApiKey
        }
    };

    try {
        log.info('Posting location to server...');
        log.debug(dataToPost);

        return new Promise((resolve, reject) => {
            const httpRequest = https.request(postOptions, (res) => {
                if (res.statusCode == 200) {
                    resolve(true);
                }
                else {
                    reject(false);
                }
            });

            httpRequest.write(dataToPost);
            httpRequest.end();
        });
    } catch (message) {
        log.error(`Unable to post data to server. ${message}`);
        throw new Error(message);
    }
};

module.exports = {
    uploadLocationToServer
};