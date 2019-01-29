const https = require('https');
const log = require("./log");
const config = require('./config');

const uploadLocationToServer = async (dataToPost) => {
    return new Promise((resolve, reject) => {
        const postOptions = {
            host: config.AwsApiUrl,
            path: config.AwsApiUrlEndpoint,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": config.AwsApiGatewayApiKey
            }
        };

        log.info('Posting location to server...');
        log.debug(dataToPost);

        
        const httpRequest = https.request(postOptions, (res) => {
            if (res.statusCode !== 200) {
                reject(false);
            } else {
                resolve(true);
            }
        });

        httpRequest.setTimeout(10000, () => {  
            log.error('Uploading location to server timed out.');
            reject(false);
        });

        httpRequest.write(dataToPost);
        httpRequest.end();
    });
};

module.exports = {
    uploadLocationToServer
};