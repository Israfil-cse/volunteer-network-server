const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ldvxv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 4000



const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("volunteer").collection("Items");
  const userDetail = client.db("volunteer").collection("userDetails");
    
  app.post("/addItem", (req, res) => {
      const item = req.body;
    collection.insertMany(item)
    .then(result => {
        res.send(result.insertedCount)
    })
  })


  app.get('/allItems',(req, res) => {
    collection.find({})
    .toArray((err, document) => {
      res.send(document)
    })
  })


  app.post("/addUserInfo", (req, res) => {
    const userInfo = req.body;
  userDetail.insertOne(userInfo)
  .then(result => {
      res.send(result.insertedCount > 0)
  })
})


  app.get('/allUserInfo',(req, res) => {
    userDetail.find({email: req.query.email})
      .toArray((err, document) => {
        res.send(document);
      })
})


  app.get('/adminAlUser', (req, res) => {
    userDetail.find({})
    .toArray((err,documents) => {
      res.send(documents)
    })
  })


  app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id)
    userDetail.deleteOne({_id: ObjectId(req.params.id)})
    .then((result) => {
      console.log(result);
    })
  })

});



app.listen(process.env.PORT || port)