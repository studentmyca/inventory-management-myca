const express = require('express');
const serverless = require('serverless-http');
const router = require('./routes/item');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const cloudDB = "mongodb+srv://magallanesmyca9:yvWEraV5mCfWKCRB@cluster0.m1cvhgz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

mongoose
  .connect(cloudDB)
  .then(()=> console.log('Connected to InventoryDB'))
  .catch((error)=>console.error('Failed to connect to InventoryDB'));

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);

// app.listen(4000,()=>{
//   console.log('Server is running on port 4000')
// })