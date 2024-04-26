const MongoClient = require('mongodb').MongoClient;
const dbName = 'custdb';
const baseUrl = "mongodb://127.0.0.1:27017";
const collectionName = "customers"
const connectString = baseUrl + "/" + dbName; 
const da = require("./data-access");
let collection;

// This is the database startup for mongodb that goes through and communicates to the saved quaries for any changes
async function dbStartup() {
    const client = new MongoClient(connectString);
    await client.connect();
    collection = client.db(dbName).collection(collectionName);
}

// Awaiting collection for the get customer array
async function getCustomers() {
    return await collection.find().toArray();
}

// Upon database startup it has the module exports of the listed properties that are used later on in the script.  
dbStartup();
module.exports = { getCustomers, resetCustomers, addCustomer,
    getCustomerById, updateCustomer, deleteCustomerById };

// This is the catch for the getCustomers property. It awaits the collection of data from the array. 
// it will either return the customer information or it will log and return the error. 
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

// resetCustomers has a static array of users that it will default back to one the "reset" button is pressed on the site. 
// The try will look to see if there is any differences from the static list and it will automatically
// default back to the static list. It will also log the error message and return the error.
async function resetCustomers() {
    let data = [{ "id": 0, "name": "Mary Jackson", "email": "maryj@abc.com", "password": "maryj" },
    { "id": 1, "name": "Karen Addams", "email": "karena@abc.com", "password": "karena" },
    { "id": 2, "name": "Scott Ramsey", "email": "scottr@abc.com", "password": "scottr" }];

    try {
        await collection.deleteMany({});
        await collection.insertMany(data);
        const customers = await collection.find().toArray();
        const message = "data was refreshed. There are now " + customers.length + " customer records!"
        return [message, null];
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
}

// addCustomer will try to insert the data to add to teh collection and return if the addition of said infomration is successful
// if unsuccessful it will log the reason why, say it failed and then throw the error as well. 
async function addCustomer(newCustomer) {
    try {
        const insertResult = await collection.insertOne(newCustomer);
        // return array [status, id, errMessage]
        return ["success", insertResult.insertedId, null];
    } catch (err) {
        console.log(err.message);
        return ["fail", null, err.message];
    }
}

// This function will grab the customer id to pull the current information in their block if they are present in the system
// ie. if id-13 has information it will pull it from the query and display it. However, it will return invalid customer number
// if none is present. If it errors out it will display in console and return an error message.
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

// This function will look through the existing customer information and check if the id matches.
// If the id matches then you are able to adjust the customer information. Once complete it will return a completion message.
// If failed it will log the error and display it. 
async function updateCustomer(updatedCustomer) {
    try {
        const filter = { "id": updatedCustomer.id };
        const setData = { $set: updatedCustomer };
        const updateResult = 
        await collection.updateOne(filter, setData);
        // return array [message, errMessage]
        return ["one record updated", null];
    } catch (err) {
        console.log(err.message);
        return [ null, err.message];
    }
}

// This function will delete the customer information if the id matches in the request. If nothing is found it will alert with
// no record deleted. If there is a match and it removes the content you will get a success message. If it fails all together 
// It will error out, catch the error and log it along with displaying the error.
async function deleteCustomerById(id) {
    try {
        const deleteResult = await collection.deleteOne({ "id": +id });
        if (deleteResult.deletedCount === 0) {
            // return array [message, errMessage]
            return [null, "no record deleted"];
        } else if (deleteResult.deletedCount === 1) {
            return ["one record deleted", null];
        } else {
            return [null, "error deleting records"]
        }
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
}