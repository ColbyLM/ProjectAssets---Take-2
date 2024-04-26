const express = require('express');
const path = require('path');  // for handling file paths

const app = express();
const port = process.env.PORT || 4000;  // use env var or default to 4000

const da = require("./data-access");

const bodyParser = require('body-parser');

// Set the static directory to serve files from
app.use(express.static(path.join(__dirname, 'public')));

// Listening to the port for whatever it is set at in this case PORT 4000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// This is a get customer utility that will await customer information and will give a 500 if failed
app.get("/customers", async (req, res) => {
  const cust = await da.getCustomers();
  res.send(cust);    
});

// This will get the customer information that is set in the query. If successful it will display the information. 
// Upon failure it will send a 500 error. 
app.get("/customers", async (req, res) => {
  const [cust, err] = await da.getCustomers();
  if(cust){
      res.send(cust);
  }else{
      res.status(500);
      res.send(err);
  }   
});

// This is a reset function that will check the current query of information and regardless of the result 
// it will reset back to the static set of infomration outlined in the reset function in data-access.js. If 
//successful it will send the result. If not it will send a 500 error.
app.get("/reset", async (req, res) => {
  const [result, err] = await da.resetCustomers();
  if(result){
      res.send(result);
  }else{
      res.status(500);
      res.send(err);
  }   
});

app.use(bodyParser.json());

// With the post property. It will check the information in postman and make sure it is not an empty submission.
// If there are any missing components within postman during the post attempt it will alert that there are missing 
// properties. If it is able to communicate and has the required information it will post the infromation with a success message.
app.post('/customers', async (req, res) => {
  const newCustomer = req.body;
  // Check if the request body is missing
  if (Object.keys(req.body).length === 0) {
    res.status(400).send("missing request body");
     } else {
         // Check if the required properties are present
  if (!newCustomer.name || !newCustomer.email) {
  res.status(400).send("missing required properties");
  return;
         }
         // Handle the request
   const [status, id, errMessage
         ] = await da.addCustomer(newCustomer);
  if (status === "success") {
  res.status(201).send({ ...newCustomer, _id: id
             });
         } else {
  res.status(400).send(errMessage);
         }
     }
 });

 // This will get the customer id and check if it exists. If successful it will display the information.
 // if unsuccessful then it will error out. 
 app.get("/customers/:id", async (req, res) => {
  const id = req.params.id;
  // return array [customer, errMessage]
  const [cust, err] = await da.getCustomerById(id);
  if(cust){
      res.send(cust);
  }else{
      res.status(404);
      res.send(err);
  }   
});

// This will check the requested customer id and see if it exists. If successful it will go through and update the information.
// If not it will show the error 400 with the error message. 
app.put('/customers/:id', async (req, res) => {
  const id = req.params.id;
  const updatedCustomer = req.body;
  if (Object.keys(req.body).length === 0) {
    res.status(400).send("missing request body");
  } else {
      delete updatedCustomer._id;
      // return array format [message, errMessage]
      const [message, errMessage] = await da.updateCustomer(updatedCustomer);
      if (message) {
          res.send(message);
      } else {
          res.status(400);
          res.send(errMessage);
      }
  }
});

// This will check on this current list of customer infomration and if it sees the request of a specific id
// it will go through and delete it. If failed it will give a 404 error and show the error message in postman. 
app.delete("/customers/:id", async (req, res) => {
  const id = req.params.id;
  // return array [message, errMessage]
  const [message, errMessage] = await da.deleteCustomerById(id);
  if (message) {
      res.send(message);
  } else {
      res.status(404);
      res.send(errMessage);
  }
});