const GpsDevice = '/dev/ttyAMC0';

const AwsApiUrl = '6vrsjvr5v1.execute-api.eu-west-1.amazonaws.com';
const AwsApiUrlEndpoint = '/Live/location';

const MongoDbConnectionUrl = 'mongodb://localhost:27017';
const MongoDbDatabase = 'CarTracker';
const MongoDbCollection = 'LocationHistory';

const userId = 'some-user-id';

module.exports = {
    GpsDevice,
    AwsApiUrl,
    AwsApiUrlEndpoint,
    MongoDbConnectionUrl,
    MongoDbDatabase,
    MongoDbCollection,
    userId
};