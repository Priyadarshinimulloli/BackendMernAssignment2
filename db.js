const express=require('express');
const app=express();
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");

const dbUrl =
  "mongodb+srv://priyadarshinimulloli:priya01@cluster0.p1ssx.mongodb.net/?appName=Cluster0";

const client = new MongoClient(dbUrl, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

async function setupSynergiaCollection(){
    const database=client.db('Synergia')
    const events=database.createCollection('events')
    

    .then(() => {
        console.log("Created events collection");
    })
    .catch((err) => {
        console.error("Error creating events collection:", err);
    });

}
//setupSynergiaCollection();