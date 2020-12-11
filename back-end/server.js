const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');
var toDisplay = [];
var allItems = [];
// connect to the database
mongoose.connect('mongodb://localhost:27017/museum', {
  useNewUrlParser: true
});

app.post('/api/toDisplay', async (req, res) => {
  let currTitle = req.body.title;
  let currDesc = req.body.description;
  let currPath = req.body.path;
  const newItem = new Item({
    title: currTitle,
    description: currDesc,
    path: currPath,
  });
  if (toDisplay.length !== 0) {
    for (let i = 0; i < allItems.length; i++) {
      if (allItems[i] === newItem) {
        for (let j = 0; j < toDisplay.length; j++) {
          if (toDisplay[j].description === newItem.description) {
            toDisplay[j] = newItem;
            res.send(newItem);
          }
        }
      }
    }
  }
  toDisplay.push(newItem);
  let temp = [];
  for (let i = 0; i < toDisplay.length; i++) {
    if (newItem.description ==="Head") {
      temp.push(newItem);
      break;
    }
    else if(toDisplay[i].description === "Head") {
      temp.push(toDisplay[i]);
      break;
    }
  }
  for (let i = 0; i < toDisplay.length; i++) {
    if (newItem.description ==="Body") {
      temp.push(newItem);
      break;
    }
    else if(toDisplay[i].description === "Body") {
      temp.push(toDisplay[i]);
      break;
    }
  }
  for (let i = 0; i < toDisplay.length; i++) {
    if (newItem.description ==="Legs") {
      temp.push(newItem);
      break;
    }
    else if(toDisplay[i].description === "Legs") {
      temp.push(toDisplay[i]);
      break;
    }
  }
  toDisplay = temp;

  res.send(newItem);
});

// Create a new item in the museum: takes a title and a path to an image.
app.post('/api/items', async (req, res) => {

  const item = new Item({
    title: req.body.title,
    description: req.body.description,
    path: req.body.path,
  });
  try {
    await item.save();
    res.send(item);
  } catch (error) {

    res.sendStatus(500);
  }
});

// Configure multer so that it will upload to '../front-end/public/images'
const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 10000000
  }
});

// Create a scheme for items in the museum: a title and a path to an image.
const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  path: String,
});

// Create a model for items in the museum.
const Item = mongoose.model('Item', itemSchema);

// Create a scheme for items in the museum: a title and a path to an image.
const headSchema = new mongoose.Schema({
  title: String,
  description: String,
  path: String,
});

// Create a model for items in the museum.
const Head = mongoose.model('Item', itemSchema);

// Create a scheme for items in the museum: a title and a path to an image.
const legsSchema = new mongoose.Schema({
  title: String,
  description: String,
  path: String,
});

// Create a model for items in the museum.
const Legs = mongoose.model('Item', itemSchema);

// Create a scheme for items in the museum: a title and a path to an image.
const bodySchema = new mongoose.Schema({
  title: String,
  description: String,
  path: String,
});

// Create a model for items in the museum.
const Body = mongoose.model('Item', itemSchema);

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async (req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});
// Get a list of all of the items in the museum.
app.get('/api/items', async (req, res) => {
  try {

    let items = await Item.find();
    allItems = items;
    res.send(items);
  } catch (error) {

    res.sendStatus(500);
  }
});
app.get('/api/heads', async (req, res) => {
  try {
    let heads = await Head.find();
    let trueHeads = [];
    for(let i = 0; i < heads.length; i++) {
      if (heads[i].description === "Head") {
        trueHeads.push(heads[i]);
      }
    }
    res.send(trueHeads);
  } catch (error) {

    res.sendStatus(500);
  }
});
app.get('/api/bodies', async (req, res) => {
  try {
    let bodies = await Body.find();
    let trueBodies = [];
    for(let i = 0; i < bodies.length; i++) {
      if (bodies[i].description === "Body") {
        trueBodies.push(bodies[i]);
      }
    }
    res.send(trueBodies);
  } catch (error) {

    res.sendStatus(500);
  }
});
app.get('/api/legs', async (req, res) => {
  try {
    let legs = await Legs.find();
    let trueLegs = [];
    for(let i = 0; i < legs.length; i++) {

      if (legs[i].description === "Legs") {
        trueLegs.push(legs[i]);
      }
    }
    res.send(trueLegs);
  } catch (error) {

    res.sendStatus(500);
  }
});
app.get('/api/toDisplay', async (req, res) => {
  try {

    res.send(toDisplay);
  } catch (error) {

    res.sendStatus(500);
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    await Item.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {

    res.sendStatus(500);
  }
});

app.put('/api/items/:id', async (req, res) => {

  try {
    let item = await Item.findOne({
      _id: req.params.id
    });
    item.title = req.body.title;
    item.description = req.body.description;
    item.save();
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});


app.listen(3000, () => console.log('Server listening on port 3000!'));
