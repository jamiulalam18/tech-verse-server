const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

//middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://jamiulalam95:lrzGV94TqnPVtHWC@cluster0.idds8so.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const dataset = client.db("techVerseDB");

    const usersCollection = dataset.collection("users");
    const brandsCollection = dataset.collection("brands");
    const productsCollection = dataset.collection("products");

    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const result = await usersCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const result = await productsCollection.find().toArray();
      res.send(result);
    });
    app.post("/products", async (req, res) => {
      const new_product=req.body;
      const result = await productsCollection.insertOne(new_product);
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productsCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });
    app.get("/brandDetails/:id", async (req, res) => {
      const id = req.params.id;
      const brand = await brandsCollection.findOne({
        _id: new ObjectId(id),
      });
      const result = await productsCollection
        .find({ brand_name: brand.brand_name })
        .toArray();
      res.send(result);
    });

    app.get("/brandInfo", async (req, res) => {
      const result = await brandsCollection.find().toArray();
      res.send(result);
    });

    app.get("/brandInfo/:id", async (req, res) => {
      const id = req.params.id;
      const result = await brandsCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    app.get("/brandInfoByName/:name", async (req, res) => {
      const name = req.params.name;
      const result = await brandsCollection.findOne({
        brand_name: name,
      });
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from server!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



// ভার্সেল ও ডিপ্লয় করার পর যদি ডাটা আসতে লেট হয় await client.connect() এবং await client.db (এই লাইনটা নিচের দিকে)এই দুইটা লাইন কেটে দিয়ে
// যে গুলো require করতেছেন সেগুলো এমনভাবে রিফ্যাক্টর করে নেবেন।
// const express = require('express');
// const app = express();
// const cors = require('cors');
// require('dotenv').config()
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const port= process.env.PORT || 5000
// এরপর vercel --prod দিয়ে আপডেট করে নতুন যে লিংক পাবেন সেটা চেক করে ফ্রন্টইন্ড এ আপডেট করে দেবেন।
// এই কাজগুলো করে ফিক্সড করে জমা দেন