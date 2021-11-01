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
        const serviceCollectionTwo = database.collection('order-offer');
        
        // Get API 
        app.get('/services', async (req, res) => {
            const query = serviceCollection.find({});
            const services = await query.toArray();
            res.json(services);
        });

        // POST API IN MAIN OFFER
        app.post('/services', async (req, res) => {
            const getOffer = req.body;
            const result = await serviceCollection.insertOne(getOffer);
            console.log('Added success')
            res.json(result);
        });

        // UPDATE APPROVED API
        app.put('/my_orders/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updateApproved = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updateApproved.status,
                }
            };
            const result = await serviceCollectionTwo.updateOne(filter, updateDoc, options);
            res.json(result);
        })

        // Get API single 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(req.params);
            const query = { _id: ObjectId(id) };
            const TourService = await serviceCollection.findOne(query);
            res.json(TourService);
        });

        // POST API 
        app.post('/get_offer', async (req, res) => {
            const getData = req.body;
            const data = await serviceCollectionTwo.insertOne(getData);
            res.json(data);
        });

        // GET SIGN API 
        app.get('/my_orders', async (req, res) => {
            const query = serviceCollectionTwo.find({});
            const orders = await query.toArray();
            res.json(orders);
        });

        // DELETE API 
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await serviceCollectionTwo.deleteOne(query); 
            res.json(result);
        });

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