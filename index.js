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

app.get('/', (req, res) =>{
  res.send('HI, I am Israfil and this is my voluinteer server API')
})

const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("volunteer").collection("Items");
  const userDetail = client.db("volunteer").collection("userDetails");
  const adminCollection = client.db("volunteer").collection("adminPanel");
    
  app.post("/addItem", (req, res) => {
      const item = req.body;
    collection.insertMany(item)
    .then(result => {
        res.send(result.insertedCount)
    })
  })


  app.get('/allItems',(req, res) => {
    const search = req.query.search;
    collection.find({name: {$regex: search}})
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



  // admin
  app.get('/checkAdmin', (req, res) => {
    const email = req.query.email;
    adminCollection.find({email: email})
      .toArray((err, documents) => {
        if(documents.length === 0){
          res.send({admin: false})
        }else{
          res.send({admin: true})
        }
      })
  })


// insert service
app.post('/addService', (req, res) => {
  const file = req.files.file;
  const name = req.body.name;
  const newImg = file.data;
  const encImg = newImg.toString('base64');

  var image = {
    contentType: file.mimetype,
    size: file.size,
    img: Buffer.from(encImg, 'base64')
  };

  collection.insertOne({ name, image })
    .then(result => {
      res.send(result.insertedCount > 0)
    })
})

});



app.listen(process.env.PORT || port)