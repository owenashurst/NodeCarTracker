const GpsDevice = '/dev/ttyAMC0';

const AwsApiUrl = 'jpc905lswi.execute-api.eu-west-1.amazonaws.com';
const AwsApiUrlEndpoint = '/Live/location';

const AwsDynamoTableRecordExpireInDays = 5;

const userId = 'some-user-id';

module.exports = {
    GpsDevice,
    AwsApiUrl,
    AwsApiUrlEndpoint,
    AwsDynamoTableRecordExpireInDays,
    userId
};