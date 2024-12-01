const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ho6hi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // Connect to MongoDB
        // await client.connect();

        // Database and Collection
        const db = client.db("coffeeDB");
        const userCollection = db.collection("userCollection");

        // Routes
        // Get All Users
        app.get('/users', async (req, res) => {
            try {
                const cursor = userCollection.find();
                const users = await cursor.toArray();
                res.send(users);
            } catch (error) {
                res.status(500).send({ error: 'Failed to fetch users' });
            }
        });

        // get user using id

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.findOne(query)
            res.send(result)
        })

        // Add a New User
        app.post('/users', async (req, res) => {
            const user = req.body;
            try {
                const result = await userCollection.insertOne(user);
                res.send(result);
            } catch (error) {
                res.status(500).send({ error: 'Failed to add user' });
            }
        });

        // update register user
        app.patch('/users', async (req, res) => {
            const email = req.body.email;
            const filter = { email }
            const updateUser = {
                $set: {
                    name: req.body?.name,
                    email: req.body?.email,
                    gender: req.body?.gender,
                    status: req.body?.status

                }
            }
            const result = await userCollection.updateOne(filter, updateUser)
            res.send(result)


        })

        // delete user from database
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })




        // Ping MongoDB
        await client.db("admin").command({ ping: 1 });
        console.log("Successfully connected to MongoDB!");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
}
run().catch(console.dir);

// Default Route
app.get('/', (req, res) => {
    res.send("Basic server started...");
});

// Start the Server
app.listen(port, () => {
    console.log("Server running on port", port);
});
