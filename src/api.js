const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const serverless = require("serverless-http");

const DB = process.env.DATABASE;
mongoose.connect(DB);
const app = express();

app.use(cors());
app.use(express.json());

app.get("/.netlify/functions/api", (req,res)=>{
  res.send("<h1>Welcome to the Bestiary Express server</h1>")
});

const entriesSchema = new mongoose.Schema({
  name: String,
  location: String,
  mythology: String,
  description: String,
  characteristics: String,
  image: String,
  content: String
});

const entriesModel = mongoose.model("Entries", entriesSchema);

app.get('/.netlify/functions/api/read', async(req,res)=>{
  const allEntries = await entriesModel.find();
  res.send(allEntries);
});

app.get('/.netlify/functions/api/read/:id', async(req, res)=>{
  const _id = req.params.id;
  const singleID = await entriesModel.findById(_id);
  res.json(singleID);
});

app.post("/.netlify/functions/api/create", (req,res)=>{
  const newEntry = new entriesModel({
    name: req.body.name,
    location: req.body.location,
    mythology: req.body.mythology,
    description: req.body.description,
    characteristics: req.body.characteristics,
    image: req.body.image,
    content: req.body.content
  });
  newEntry.save();
  res.send("New Entrie Logged Successfully");
});

app.patch('/.netlify/functions/api/update/:id', async(req, res)=>{
  const _id = req.params.id;
  const data = await entriesModel.findById(_id);
  data.save();
  res.send(data);
});

app.delete('/.netlify/functions/api/delete/:id', async(req,res)=>{
  const _id = req.params.id;
  const name = req.body.name;
  await entriesModel.findByIdAndDelete(_id);
  res.send(`${name} has been deleted`);
})

// app.listen(8989, () => {
// 	console.log("http://localhost:8989");
// });

const handler = serverless(app);

module.exports.handler = async (event, context) => {
  const result = await handler(event, context);
  return result
};