const express = require('express');
const path = require('path');  // for handling file paths

const app = express();
const port = process.env.PORT || 4000;  // use env var or default to 4000

const da = require("./data-access");

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

app.get("/customers", async (req, res) => {
  const [cust, err] = await da.getCustomers();
  if(cust){
      res.send(cust);
  }else{
      res.status(500);
      res.send(err);
  }   
});