const express = require('express')
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 4500;
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;


app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wapuj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log("connection error", err)
  const serviceCollection = client.db(process.env.DB_NAME).collection("services");
  const reviewsCollection = client.db(process.env.DB_NAME).collection("reviews");
  const orderCollection = client.db(process.env.DB_NAME).collection("orders");

  console.log("Connection Successfully")

  app.get('/services', (req, res)=> {
    serviceCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })

  app.delete('/deleteService/:id', (req, res) =>{
    serviceCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      console.log(result)
      res.send(result.deletedCount > 0);
    })
  })

  app.post('/addService', (req, res) =>{
    const newService = req.body;
    serviceCollection.insertOne(newService)
    .then(result => {
      res.send(result.insertedCount);
    })
  })

  app.post('/addOrder', (req, res) =>{
    const newOrder = req.body;
    orderCollection.insertOne(newOrder)
    .then(result =>{
      console.log(result)
      res.send(result.insertedCount);
    })
  })

  app.get('/allOrderList', (req, res) =>{
    orderCollection.find({})
    .toArray((err, orderList) =>{
      res.send(orderList);
    })
  })

  app.get('/orderList', (req, res) =>{
    orderCollection.find({email: req.query.email})
    .toArray((err, orderList) =>{
      res.send(orderList);
    })
  })

  app.get('/reviews', (req, res) =>{
    reviewsCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })

  app.get('/order/:id', (req, res) => {
    const id = req.params.id;
    serviceCollection.find({_id: ObjectId(id)})
    .toArray((err, documents) => {
      res.send(documents[0])
    })
  })

  app.post('/addReview', (req, res) =>{
    const newReview = req.body;
    reviewsCollection.insertOne(newReview)
    .then(result =>{
      res.send(result.insertedCount);
    })
  })

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port);