const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();

const { MongoClient } = require('mongodb');
require("dotenv").config();

const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nrtib.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db('uni_travels');
        const serviceCollection = database.collection('order_peoples');
        
        // Get API 
        app.get('/services', async (req, res) => {
            const query = serviceCollection.find({});
            const services = await query.toArray();
            res.json(services);
        });

        // Get API single 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(req.params);
            const query = { _id: ObjectId(id) };
            const TourService = await serviceCollection.findOne(query);
            res.json(TourService);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('node server is running now');
});

app.listen(port, () => {
    console.log('Server Running on ', port);
})