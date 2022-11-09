const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.y4ecbmx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client
      .db("bookShop")
      .collection("booksCollection");
    const reviewCollection = client.db("bookShop").collection("allReviews");

    app.get("/books", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query).limit(3);
      const services = await cursor.toArray();
      res.send(services);
    });
    app.post("/allBooks", async (req, res) => {
      const order = req.body;
      console.log(order);
      const result = await serviceCollection.insertOne(order);
      res.send(result);
    });
    app.get("/allBooks", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/allBooks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    app.get("/allReviews", async (req, res) => {
      let query = {};

      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }

      const cursor = reviewCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

    app.post("/allReviews", async (req, res) => {
      const order = req.body;
      const result = await reviewCollection.insertOne(order);
      res.send(result);
    });

    app.get("/allReviews", async (req, res) => {
      const query = {};
      const cursor = reviewCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/allReviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        service: id,
      };
      const cursor = reviewCollection.find(query);
      const services = await cursor.toArray();
      console.log(services);
      res.send(services);
    });

    // app.patch("/orders/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const status = req.body.status;
    //   const query = { _id: ObjectId(id) };
    //   const updatedDoc = {
    //     $set: {
    //       status: status,
    //     },
    //   };
    //   const result = await orderCollection.updateOne(query, updatedDoc);
    //   res.send(result);
    // });

    // app.delete("/orders/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await orderCollection.deleteOne(query);
    //   res.send(result);
    // });
  } finally {
  }
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Online book shop server is running");
});

app.listen(port, () => {
  console.log(`Online book shop server running on ${port}`);
});
