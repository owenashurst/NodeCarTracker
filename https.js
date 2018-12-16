const https = require('https');
const log = require("./log");

uploadLocationToServer = (dataToPost) => {
    const postOptions = {
        host: "cartracker.owenashurst.com",
        path: "/api/location",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
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