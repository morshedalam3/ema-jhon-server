const express = require('express')

const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ossg7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
const port = 5000

app.use(express.json());
app.use(cors());



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err);
  const productsCollection = client.db("emaJhonStore").collection("product");
  const ordersCollection = client.db("emaJohnStore").collection("orders");

 

  app.post('/addProducts', (req, res) => {
      const products = req.body;
      productsCollection.insertOne(products)
      .then(result =>{
          console.log(result.insertedCount);

          res.send(result.insertedCount);
      })
  })

  app.get('/products', (req, res) => {
      productsCollection.find({})
      .toArray((err, documents) =>{
          res.send(documents)
      })
  })

  

  app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray((err, documents) =>{
        res.send(documents[0])
    })
})

app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({key: { $in: productKeys} })
    .toArray( (err, documents) => {
        res.send(documents);
    })
})

app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})

});

app.get('/', (req, res) => {
    res.send('hello world');
})


app.listen(process.env.PORT || port, () =>{
    console.log('iam listening')
})