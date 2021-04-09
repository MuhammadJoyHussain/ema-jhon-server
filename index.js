const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b9eao.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 4000


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJhonStore").collection("products");
  const ordersCollection = client.db("emaJhonStore").collection("orders");

    app.post('/addProduct', (req, res) =>{
        const product = req.body;
        productsCollection.insertOne(product)
        .then(result =>{
            console.log(result.insertedCount);
            res.send(result.insertedCount)
        })
    })


    app.get('/products', (req, res) => {
      productsCollection.find({})
      .toArray( (err, documents) =>{
        res.send(documents)
      })
    })
    
    
    app.get('/product/:key', (req, res) => {
      productsCollection.find({key: req.params.key})
      .toArray( (err, documents) =>{
        res.send(documents[0])
      })
    })

    app.post('/addOrder', (req, res) =>{
      const order = req.body;
      ordersCollection.insertOne(order)
      .then(result =>{
          res.send(result.insertedCount > 0)
      })
  })


});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)