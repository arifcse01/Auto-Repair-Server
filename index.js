const express = require('express')
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 4500;
require('dotenv').config();


app.use(express.json());
app.use(cors());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wapuj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log("connection error", err)
  const collection = client.db(process.env.DB_NAME).collection("services");
  // perform actions on the collection object
  console.log("Connection Successfully")
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)