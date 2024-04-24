const express = require('express');
const path = require('path');  // for handling file paths

const app = express();
const port = process.env.PORT || 4000;  // use env var or default to 4000

// Set the static directory to serve files from
app.use(express.static(path.join(__dirname, 'public')));

// Listening to the port for whatever it is set at in this case PORT 4000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Gets customer ids and goes through else/if statement. It will either get the information or give a 404 error message
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

