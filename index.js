const express = require('express');
const cors = require('cors');
var jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;


const app=express();
//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nfm1t0q.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const productCatagoryCollection = client.db('helloDotCom').collection('productsCatagory')
        const allPhoneCollection = client.db('helloDotCom').collection('allPhone')
        const advertisedPhoneColection = client.db('helloDotCom').collection('advertisedPhone')
        const bookingPhoneCollection = client.db('helloDotCom').collection('bookingPhone')
        const usersCollection=client.db('helloDotCom').collection('users')
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
        // Advertise data insert from clint side
        app.post('/advertised', async (req,res)=>{
            const advertisedPhone=req.body 
            const result = await advertisedPhoneColection.insertOne(advertisedPhone)
            res.send(result)
        })
        // Get advertice data from database
        app.get('/advertised', async (req,res)=>{
            const query = {}
            const result = await advertisedPhoneColection.find(query).toArray()
            res.send(result)

        })
        // Booking data insert from clint side
        app.post('/booking', async(req,res)=>{
            const bookingPhone = req.body
            const result = await bookingPhoneCollection.insertOne(bookingPhone)
            res.send(result)
        })
        // Get Booking data from database 
        app.get('/booking', async (req,res)=>{
            const email = req.query.email
            const query = {email:email}
            const result = await bookingPhoneCollection.find(query).toArray()
            res.send(result)
        })
        // Delate booking data
        app.delete('/booking/:id', async (req,res)=>{
            const id = req.params.id 
            const query = {_id:ObjectId(id)}
            const result = await bookingPhoneCollection.deleteOne(query)
            res.send(result)
        })
        // Save users from clint side and generate jwt
        app.put('/user/:email', async(req,res)=>{
            const email = req.params.email 
            const user = req.body
            const query = {email:email}
            const options = {upsert:true}
            const updateDoc = {
                $set:user,
            }
            const result = await usersCollection.updateOne(query,updateDoc,options)
            console.log(result);
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn:'1d',
            })
            console.log(token);
            res.send({result,token})
        })
        
        //Get all users
        app.get('/allUsers', async(req,res)=>{
            const query = {}
            const result = await usersCollection.find(query).toArray()
            res.send(result)
        })
        //Delate users
        app.delete('/allUsers/:id', async(req,res)=>{
            const id = req.params.id 
            const query = {_id:ObjectId(id)}
            const result = await usersCollection.deleteOne(query)
            res.send(result)
        })
        //Check Admin
        app.get('/admin/:email', async(req,res)=>{
            const email = req.params.email 
            const query ={email}
            const result = await usersCollection.findOne(query)
            res.send({isAdmin:result.role === 'admin'})
        })
        //Check Seller
        app.get('/seller/:email',async(req,res)=>{
            const email = req.params.email 
            const query ={email}
            const result = await usersCollection.findOne(query)
            res.send({isSeller:result.role === 'seller'})
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