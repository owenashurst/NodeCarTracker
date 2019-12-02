const https = require('https');
const config = require('./config');

const uploadLocationToServer = async (dataToPost) => {
    return new Promise((resolve, reject) => {
        const postOptions = {
            host: config.AWS.API_URL,
            path: config.AWS.API_ENDPOINT,
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        };
        
        const httpRequest = https.request(postOptions, (res) => {
            let body = '';

            res.on('data', (chunk) => {
                body += chunk;
            });

            if (res.statusCode !== 200) {
                reject(false);
            } else {
                resolve(body);
            }
        });

        httpRequest.on('error', (error) => {
            reject(error);
        });

        httpRequest.write(dataToPost);
        httpRequest.end();
    });
};

module.exports = {
    uploadLocationToServer
};