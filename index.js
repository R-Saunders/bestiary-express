const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

const DB = process.env.DATABASE;
const connectDB = mongoose.connect(DB);
console.log(connectDB);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
  res.send("<h1>Welcome to the Bestiary Express server</h1>")
});

const entriesSchema = new mongoose.Schema({
  name: String,
  location: String,
  mythology: String,
  description: String,
  characteristics: Array,
  image: Image,
  content: String
});

const entriesModel = mongoose.model("Entries", entriesSchema);

app.get('/read', async(req,res)=>{
  const allEntries = await entriesModel.find();
  res.send(allEntries);
});

app.get('/read/:id', async(req, res)=>{
  const _id = req.params.id;
  const data = await entriesModel.findById(_id);
  res.send(data);
});

app.post("/create", (req,res)=>{
  const newEntrie = new entriesModel({
    name: req.body.name,
    location: req.body.location,
    mythology: req.body.mythology,
    description: req.body.description,
    characteristics: req.body.characteristics,
    image: req.body.image,
    content: req.body.content
  });
  newEntrie.save();
  res.send("New Entrie Logged Successfully");
});

app.patch('/update/:id', async(req, res)=>{
  const _id = req.params.id;
  const data = await entriesModel.findById(_id);
  data.save();
  res.send(data);
});

app.delete('/delete/:id', async(req,res)=>{
  const _id = req.params.id;
  const name = req.body.name;
  await entriesModel.findByIdAndDelete(_id);
  res.send(`${name} has been deleted`);
})

app.listen(8989, () => {
	console.log("http://localhost:8989");
});