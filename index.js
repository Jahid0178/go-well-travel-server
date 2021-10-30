const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ffuko.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("go_well_travel");
    const bookingCollection = database.collection("booking");
    const bestTopCollection = database.collection("bestTop");
    const orderCollection = database.collection("orders");
    // GET API
    app.get("/booking", async (req, res) => {
      const cursor = bookingCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.findOne(query);
      res.send(result);
    });

    app.get("/best-top", async (req, res) => {
      const cursor = bestTopCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // ORDER API
    app.post("/orders", async (req, res) => {
      const result = await orderCollection.insertOne(req.body);
      res.json(result);
    });

    // POST API
    app.post("/booking", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.json(result);
    });

    // UPDATE API
    app.put("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const updatedBooking = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedBooking.name,
          package: updatedBooking.package,
          description: updatedBooking.description,
          places: updatedBooking.places,
          rank: updatedBooking.rank,
          country: updatedBooking.country,
          img: updatedBooking.img,
        },
      };
      const result = await bookingCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // DELETE API
    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running...");
});

app.listen(port, () => {
  console.log("listening to port", port);
});
