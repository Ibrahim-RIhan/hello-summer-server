const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aibqdpa.mongodb.net/?retryWrites=true&w=majority`;
const app = express();
// middleware
app.use(cors())
app.use(express.json());



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
const usersCollection = client.db("summerDb").collection("users");
const classCollection = client.db("summerDb").collection("classes");


// user Api 
app.get('/users' , async (req, res) => {
  const result = await usersCollection.find().toArray();
  res.send(result);
})
app.post('/users', async (req, res) => {
  const user = req.body;
  const query = {email : user.email }
  const exitingUser = await usersCollection.findOne(query);
  if(exitingUser){
    return res.send({message : 'User already exists'})
  }
  const result = await usersCollection.insertOne(user);
  res.send(result)
})

app.patch('users/admin/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id : new ObjectId(id)};
  const updatedDoc = {
    $set : {
      role : 'admin'
    }
  }
  const result = await usersCollection.updateOne(query, updatedDoc);
  res.send(result);
})

app.patch('users/instructor/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id : new ObjectId(id)};
  const updatedDoc = {
    $set : {
      role : 'instructor'
    }
  }
  const result = await usersCollection.updateOne(query, updatedDoc);
  res.send(result);
})


// class api 
app.get('classes', async(req, res)=> {
  const result = await classCollection.find().toArray();
  res.send(result);
})
app.post ('classes', async(req, res)=> {
  const newClass = req.body;
  const result = await classCollection.insertOne(newClass);
  res.send(result);
})




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Server is Running')
  })
  
  app.listen(port, () => {
    console.log(`Server listening on ${port}`);
  })