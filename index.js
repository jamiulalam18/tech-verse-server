// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();
// const port = process.env.PORT || 5000;
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const app = express();

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port= process.env.PORT || 5000

//middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);

// const uri =
//   "mongodb+srv://<username>:<pass>@cluster0.idds8so.mongodb.net/?retryWrites=true&w=majority";

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.idds8so.mongodb.net/?retryWrites=true&w=majority`;
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
    // await client.connect();
    const dataset = client.db("techVerseDB");

    const usersCollection = dataset.collection("users");
    const brandsCollection = dataset.collection("brands");
    const productsCollection = dataset.collection("products");

    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.get("/users/:id", async (req, res) => {
      console.log("/users/:id");
      const id = req.params.id;
      const result = await usersCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.get("/usersByEmail/:email", async (req, res) => {
      console.log("/usersByEmail/:email");
      const email = req.params.email;
      const result = await usersCollection.findOne({ email: email });
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      console.log("/users");
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.patch("/usersCart/:id", async (req, res) => {
      console.log("/usersCart/:id");
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCart = req.body;
      console.log(id);
      const product = {
        $set: {
          shopping_cart: updatedCart,
        },
      };

      const result = await usersCollection.updateOne(filter, product, options);
      res.send(result);
    });

    app.patch("/usersCartEmail/:email", async (req, res) => {
      console.log("/usersCartEmail/:email");
      const email = req.params.email;
      const filter = { email: email };
      const options = { upsert: true };
      const updatedCart = req.body;
      console.log(email);
      const product = {
        $set: {
          shopping_cart: updatedCart,
        },
      };

      const result = await usersCollection.updateOne(filter, product, options);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      console.log("/products");
      const result = await productsCollection.find().toArray();
      res.send(result);
    });
    app.post("/products", async (req, res) => {
      const new_product = req.body;
      const result = await productsCollection.insertOne(new_product);
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      console.log("/products/:id");
      const id = req.params.id;
      const result = await productsCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = req.body;
      const product = {
        $set: {
          brand_name: updatedProduct.brand_name,
          product_name: updatedProduct.product_name,
          product_category: updatedProduct.product_category,
          product_image: updatedProduct.product_image,
          product_price: updatedProduct.product_price,
          product_rating: updatedProduct.product_rating,
          product_short_description: updatedProduct.product_short_description,
          product_long_description: updatedProduct.product_long_description,
          product_highlights: updatedProduct.product_highlights,
        },
      };

      const result = await productsCollection.updateOne(
        filter,
        product,
        options
      );
      res.send(result);
    });

    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = req.body;

      const product = {
        $set: {
          brand_name: updatedProduct.brand_name,
          product_name: updatedProduct.product_name,
          product_category: updatedProduct.product_category,
          product_image: updatedProduct.product_image,
          product_price: updatedProduct.product_price,
          product_rating: updatedProduct.product_rating,
          product_short_description: updatedProduct.product_short_description,
          product_long_description: updatedProduct.product_long_description,
          product_highlights: updatedProduct.product_highlights,
        },
      };

      const result = await productsCollection.updateOne(
        filter,
        product,
        options
      );
      res.send(result);
    });

    app.get("/brandDetails/:id", async (req, res) => {
      console.log("/brandDetails/:id");
      const id = req.params.id;
      console.log(id);
      const brand = await brandsCollection.findOne({
        _id: new ObjectId(id),
      });
      const result = await productsCollection
        .find({ brand_name: brand.brand_name })
        .toArray();
      console.log(result);
      res.send(result);
    });

    app.get("/brandInfo", async (req, res) => {
      console.log("/brandInfo");
      const result = await brandsCollection.find().toArray();
      res.send(result);
    });

    app.get("/brandInfo/:id", async (req, res) => {
      console.log("/brandInfo/:id");
      const id = req.params.id;
      const result = await brandsCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    app.get("/brandInfoByName/:name", async (req, res) => {
      console.log("/brandInfoByName/:name");
      const name = req.params.name;
      const result = await brandsCollection.findOne({
        brand_name: name,
      });
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
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
