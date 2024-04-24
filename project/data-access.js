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

// This is trying to get the array of customers by the id it is assigned. If nothing it will show invalid
// customer. This will also log in the console if something fails. 
async function getCustomerById(id) {
    try {
        const customer = await collection.findOne({"id": +id});
        // return array [customer, errMessage]
        if(!customer){
          return [ null, "invalid customer number"];
        }
        return [customer, null];
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
}