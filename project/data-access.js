const MongoClient = require('mongodb').MongoClient;
const dbName = 'custdb';
const baseUrl = "mongodb://127.0.0.1:27017";
const collectionName = "customers"
const connectString = baseUrl + "/" + dbName; 
const da = require("./data-access");
let collection;

async function dbStartup() {
    const client = new MongoClient(connectString);
    await client.connect();
    collection = client.db(dbName).collection(collectionName);
}

// Awaiting collection for the get customer array
async function getCustomers() {
    return await collection.find().toArray();
}

dbStartup();
module.exports = { getCustomers };

async function getCustomers() {
    try {
        const customers = await collection.find().toArray();
        // throw {"message":"an error occured"};
        return [customers, null];
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
}