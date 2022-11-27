const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;


const app=express();
//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nfm1t0q.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const productCatagoryCollection = client.db('helloDotCom').collection('productsCatagory')
        const allPhoneCollection = client.db('helloDotCom').collection('allPhone')
        const advertisedPhoneColection = client.db('helloDotCom').collection('advertisedPhone')
        // Get Catagory
        app.get('/catagory', async (req,res)=>{
            const query = {}
            const result = await productCatagoryCollection.find(query).toArray()
            res.send(result)
        })
        //Post phone info From Clint Side
        app.post('/phones',async (req,res)=>{
            const phoneInfo = req.body
            const result = await allPhoneCollection.insertOne(phoneInfo)
            res.send(result)
        })
        
        // Get phone data with brand
        app.get('/phones', async (req,res)=>{
            const brand = req.query.brand
            const query ={brand:brand}
            const result = await allPhoneCollection.find(query).toArray()
            res.send(result)

        })
        // get phones data with email
        app.get('/myPhones', async (req,res)=>{
            const email = req.query.email
            const query = {email:email}
            const result = await allPhoneCollection.find(query).toArray()
            res.send(result)
        })
        // Advertise data insert
        app.post('/advertised', async (req,res)=>{
            const advertisedPhone=req.body 
            const result = await advertisedPhoneColection.insertOne(advertisedPhone)
            res.send(result)
        })
        
        
    }
    finally{

    }
}
run().catch(console.log);


app.get('/', async (req,res)=>{
    res.send('Hello dot Com server is Running')
})

app.listen(port, ()=>console.log(`Hello Dot Com Running from ${port}`))