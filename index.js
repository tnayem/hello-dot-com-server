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
        // Get Catagory
        app.get('/catagory', async (req,res)=>{
            const query = {}
            const result = await productCatagoryCollection.find(query).toArray()
            res.send(result)
        })
        // Get samsung phone data
        app.get('/phones', async (req,res)=>{
            const brand = req.query.brand
            const query ={brand:brand}
            const result = await allPhoneCollection.find(query).toArray()
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