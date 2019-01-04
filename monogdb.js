const mongoDbClient = require('mongodb').MongoClient;
const config = require('./config');
const log = require("./log");

const init = async () => {
    await createCollection();
    await deleteAllCollectionData();
}

const insertIntoCollection = (data) => {
    return new Promise( (resolve, reject) => {
        try {
            mongoDbClient.connect(config.MongoDbConnectionUrl, (error, client) => {
                if (error) {
                    log.error(`Unable to connect to database. ${error}`);
                }

                log.info('Inserting data into MongoDb...');
                log.debug(JSON.stringify(data));

                const db = client.db(config.MongoDbDatabase);
                db.collection(config.MongoDbCollection).insertOne({
                    data
                }).then(resolve());
            });
        }
        catch (errorMessage) {
            log.error(`Unable to insert data into collection. ${errorMessage}`);
            reject(errorMessage);
        }
    });
}

const createCollection = () => {
    return new Promise( (resolve, reject) => {
        try {
            mongoDbClient.connect(config.MongoDbConnectionUrl, (error, client) => {
                if (error) {
                    log.error(`Unable to connect to database. ${error}`);
                }

                log.info('Creating MongoDB collection...');

                const db = client.db(config.MongoDbDatabase);
                db.createCollection(config.MongoDbCollection).then(resolve());
            });
        }
        catch (errorMessage) {
            log.error(`Unable to create collection. ${errorMessage}`);
            reject(errorMessage);
        }
    });
}

const deleteAllCollectionData = () => {
    return new Promise( (resolve, reject) => {
        try {
            mongoDbClient.connect(config.MongoDbConnectionUrl, (error, client) => {
                if (error) {
                    log.error(`Unable to connect to database. ${error}`);
                }

                log.info('Deleting all collection data...');

                const db = client.db(config.MongoDbDatabase);
                db.collection(config.MongoDbCollection).deleteMany({}).then(resolve());
            });
        }
        catch (errorMessage) {
            log.error(`Unable to wipe collection data. ${errorMessage}`);
            reject(errorMessage);
        }
    });
};

module.exports = {
    init,
    insertLatestLocationToDb: insertIntoCollection
}