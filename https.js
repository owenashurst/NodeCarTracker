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
            let body = '';
            
            res.on('data', (chunk) => {
                body += chunk;
            });

            if (res.statusCode !== 200) {
                log.info('Successfully uploaded location to server.');
                reject(false);
            } else {
                log.error(`Unsuccessful attempt at uploading location to server. Status Code: ${res.statusCode}. Message: ${body}`);
                resolve(true);
            }
        });

        httpRequest.on('error', (error) => {
            log.error(`Unsuccessful attempt at uploading location to server. ${error}`);
            reject(false);
        });

        httpRequest.write(dataToPost);
        httpRequest.end();
    });
};

module.exports = {
    uploadLocationToServer
};