const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iq5lz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(express.json());
app.use(cors());
const port = 5000;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err);
  const reviewCollection = client.db("bestCycle").collection("Reviews");
  const serviceCollection = client.db("bestCycle").collection("Services");
  const bookingCollection = client.db("bestCycle").collection("Bookings");
  const adminCollection = client.db("bestCycle").collection("Admins");

  app.post('/addReview', (req, res) => {
    const review = req.body;
    reviewCollection.insertOne(review)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})

  app.post('/addAdmin', (req, res) => {
    const admin = req.body;
    adminCollection.insertOne(admin)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})

  app.post('/addService', (req, res) => {
  const service = req.body;
  serviceCollection.insertOne(service)
  .then(result => {
      res.send(result.insertedCount > 0)
  })
})

app.get('/reviews', (req, res) => {
    reviewCollection.find()
    .toArray( (err, items) => {
      res.send(items)
    })
  })

  app.get('/services', (req, res) => {
    serviceCollection.find()
    .toArray( (err, items) => {
      res.send(items)
    })
  })

  app.get('/service/:id', (req, res) => {
    serviceCollection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, item) => {
      res.send(item);
    })
  })

  app.post('/addBook', (req, res) => {
    const book = req.body;
    bookingCollection.insertOne(book)
    .then(result => {
      res.send(result.insertedContent > 0)
    })
  })

  app.get('/booking', (req, res) => {
    console.log(req.query.email);
    bookingCollection.find({user: req.query.email})
    .toArray( (err, documents) => {
      res.send(documents)
    })
  })

  app.get('/orders', (req, res) => {
    bookingCollection.find()
    .toArray( (err, items) => {
      res.send(items)
    })
  })

  app.delete('/delete/:id', (req, res) => {
    serviceCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then( result => {
      console.log(result);
    })
  })

  app.get('/order/:id', (req, res) => {
    bookingCollection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, documents) => {
      res.send(documents[0]);
    })
  })

  app.post('/admin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({email: email})
    .toArray( (err, documents) => {
      res.send(documents.length > 0)
    })
  })

  app.patch('/update/:id', (req, res) => {
    bookingCollection.updateOne({_id: ObjectId(req.params.id)}, 
    {
      $set: {status: req.body.status}
    })
    .then(result => {
      res.send(result.matchedCount > 0)
    })
  })

});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)