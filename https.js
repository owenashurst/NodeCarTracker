const https = require('https');
const log = require("./log");
const config = require('./config');

let failedUploads = [];

const retryFailedUploads = async () => {
    if (failedUploads.length === 0) return;

    log.info(`Retrying ${failedUploads.length} failed upload(s)...`);

    await failedUploads.forEach(async (failedUpload) => {
        log.info('Retrying failed upload...');
        log.debug(`${JSON.stringify(failedUpload)}`);
        
        const response = await uploadLocationToServer(failedUpload);
        if (response) {
            // Removes the item from the array if the POST was successful
            failedUploads.filter(dataInArray => dataInArray !== failedUpload);
        }
    });
}

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

            httpRequest.on('error', () => {
                addToFailedUploads(dataToPost);
            });
            httpRequest.write(dataToPost);
            httpRequest.end();
        });
    } catch (message) {
        log.error(`Unable to post data to server. ${message}`);
        throw new Error(message);
    }
};

const addToFailedUploads = (dataToPost) => {
    log.info('Log failed to upload.');
    try {
        if (failedUploads.filter(u => u.time === dataToPost.time).length === 0) {
            log.info('Adding location to Failed Uploads.');
            failedUploads.push(dataToPost);
        }
    } catch (message) {
        log.error(`Unable to add data to failedUploads array. ${message}`);
    }
};

module.exports = {
    uploadLocationToServer,
    retryFailedUploads
};