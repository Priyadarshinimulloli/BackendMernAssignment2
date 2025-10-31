const express=require('express');
const app=express();
app.use(express.json());
let events=[];
let register=[];
require('dotenv').config();
const { MongoClient, ServerApiVersion,ObjectId } = require("mongodb");

const dbUrl = process.env.MONGODB_URI;
if (!dbUrl) {
  console.error('MONGODB_URI environment variable not set. See .env.example');
  process.exit(1);
}

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
     // Start the HTTP server only after DB connection is successful
    app.listen(9000, () => {
      console.log("I have started");
    });
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

async function setupSynergiaCollection(){
    const database=client.db('Synergia')
    const events=database.createCollection('events')
    const booking=database.createCollection('booking')

    .then(() => {
        console.log("Created  collections");
    })
    .catch((err) => {
        console.error("Error creating collection:", err);
    });

}
//setupSynergiaCollection();

register.push({
    name:"Priyadarshini M",
    email:"priya@gmail.com",
    eventTitle:"Hackathon",
    seats:3
})
console.log(register);

events.push({
    eventId:1,
    title:"Treasure Hunt",
    desc:"Team of 5 members required to find hidden treasures using clues.",
    image:"image1.jpg",
    date:"2025-11-01",
    capacity:10,
});
console.log(events);

//events
app.get('/events',async (req, res) => {
  try{ 
    const database=client.db('Synergia')
    const eventsCollection=database.collection('events')
    const data1=await eventsCollection.find({}).toArray()
    console.log("Fetching...");
     res.send(data1);
    console.log(data1);
  } catch (err) {
        console.error("Error getting events collection:", err);
    }  
});

 app.get('/events/:id',async (req, res) => {
       try{ 
    const database=client.db('Synergia')
    const eventsCollection=database.collection('events')
    const id=parseInt(req.params.id);
    const data1=await eventsCollection.find({eventId:id}).toArray()
    console.log("Fetching...");
     res.send(data1);
    console.log(data1);
  } catch (err) {
        console.error("Error getting events collection:", err);
    }  
 });

 app.get('/events/date/:date',async (req, res) => {
        try{ 
    const database=client.db('Synergia')
    const eventsCollection=database.collection('events')
    const eventdate=req.params.date;
    const data1=await eventsCollection.find({date:eventdate}).toArray()
    console.log("Fetching...");
     res.send(data1);
    console.log(data1);
  } catch (err) {
        console.error("Error getting events collection:", err);
    }  
});

app.post('/events', async (req, res) => {
    const database=client.db('Synergia')
    const eventsCollection=database.collection('events')

    const eventId=await eventsCollection.countDocuments()+1;
    const title=req.body.title;
    const desc=req.body.desc;
    const image=req.body.image;
    const date=req.body.date;
    const capacity=req.body.capacity;
    
     if(!title || !desc || !image || !date || !capacity) {
        res.status(400).send("All fields are compulsary!!");
        return;
    }

    eventsCollection
    .insertMany([
      {
        eventId: eventId,
        title: title,
        desc: desc,
        image: image,
        date: date,
        capacity: capacity,
      }
    ])
    .then(() => {
      console.log("Values added");
      res.send("Added!")
    })
    .catch((err) => {
      console.error("Error creating events collection:", err);
    })
});

app.put('/update/:title',async (req, res) => {  
try{
    const database=client.db('Synergia')
    const eventsCollection=database.collection('events')
   const title=req.params.title;
    const updatedEvent = req.body.event;
   const data=await eventsCollection.updateOne(
    {
      title: title
    },{ $set: updatedEvent }
   )
   console.log(data);
    res.send("Updated!");
  }
   catch(err){
      console.error("Error creating events collection:", err);
    }
});

app.delete('/delete/:title',async (req, res) => {
try {
   const database=client.db('Synergia')
   const eventsCollection=database.collection('events')
   const title=req.params.title;
   const data=await eventsCollection.deleteOne(
    {
      title: title
    }
   )
   console.log(data);
    res.send("Deleted!");
  }catch(err){
      console.error("Error deleting events collection:", err);
    }
});


//booking
app.post('/api/bookings',async (req,res)=>{//	Create a new booking
//     const name=req.body.name;
//     const email=req.body.email;
//     const eventName=req.body.eventTitle;
//     const seatsRequested=req.body.seats;

//     const event=events.find(e=>e.title===eventName);
//     if(!event){
//         res.send("Event not found");
//         return;
//     }

//     if(seatsRequested>event.capacity){
//         res.send("Requested seats not available");
//         return;
//     }
//     const index=register.findIndex(e=>e.email===email && e.eventTitle===eventName);
//     console.log(index);
//     if(index===-1){
//      register.push({
//     name:name,
//     email:email,
//     eventTitle:eventName,
//     seats:seatsRequested
//     })
//     event.capacity-=seatsRequested;
//     console.log(register);
//     console.log(event.capacity);
//     res.send(`Successfully registered ${name} for ${eventName}`);
//     }else{
//         res.send("User already registered for this event");
//     }
      const database=client.db('Synergia')
    const bookingCollection=database.collection('booking')
  const name=req.body.name;
    const email=req.body.email;
    const eventName=req.body.eventTitle;
    const seatsRequested=req.body.seats;

     if(!name || !email || !eventName || !seatsRequested) {
        res.status(400).send("All fields are compulsary!!");
        return;
    }

    bookingCollection
    .insertMany([
      {
        name: name,
        email: email,
        eventTitle: eventName,
        seats: seatsRequested
      }
    ])
    .then(() => {
      console.log("Values added");
      res.send("Added!")
    })
    .catch((err) => {
      console.error("Error creating bookingcollection:", err);
    })
  
})
app.get('/api/bookings',async (req, res) => {//Get all bookings
  try{ 
    const database=client.db('Synergia')
    const bookingCollection=database.collection('booking')
    const data1=await bookingCollection.find({}).toArray()
    console.log("Fetching...");
     res.send(data1);
    console.log(data1);
  } catch (err) {
        console.error("Error getting booking collection:", err);
    }  
});
app.get('/api/bookings/:id',async (req,res)=>{//Get booking by ID
     try {    
      const database=client.db('Synergia')
    const bookingCollection=database.collection('booking')
    const id=req.params.id;
    const data1=await bookingCollection.findOne({ _id: new ObjectId(id) })
    console.log("Fetching...");
     res.send(data1);
    console.log(data1);
  }catch(err){
      console.error("Error fetching booking data:", err);
    }
});

 app.put('/booking/update/:eventTitle', async (req, res) => {//Update participant details
    try{
    const database=client.db('Synergia')
    const bookingCollection=database.collection('booking')
   const title=req.params.eventTitle;
    const updatedEvent = req.body.booking;
   const data=await bookingCollection.updateOne(
    {
      eventTitle:title
    },{ $set: updatedEvent }
   )
   console.log(data);
    res.send("Updated!");
  }
   catch(err){
      console.error("Error creating events collection:", err);
    }
 });

app.put('/booking/update/email/:email', async (req, res) => {//Update participant details
  try{
    const database=client.db('Synergia')
    const bookingCollection=database.collection('booking')
   const email=req.params.email;
    const updatedEvent = req.body.booking;
   const data=await bookingCollection.updateOne(
    {
      email:email
    },{ $set:updatedEvent }
   )
   console.log(data);
    res.send("Updated!");
  }
   catch(err){
      console.error("Error creating events collection:", err);
    }  
});

app.delete('/register/delete/:email',async (req, res) => {//Delete/cancel booking
  try{
     const database=client.db('Synergia')
    const bookingCollection=database.collection('booking')
    const email=req.params.email;
    const data=await bookingCollection.deleteOne(
      {email:email
      })
    console.log(data);
    res.send("Deleted!");
  }catch(err){
      console.error("Error deleting booking collection:", err);
    }

 });

// server now starts after successful DB connection inside run()