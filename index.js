const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const uid2 = require("uid2");
const { SHA256 } = require("crypto-js");
const encBase64 = require("crypto-js/enc-base64");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
// ------------------ mongodb -------------//
mongoose.connect(process.env.MONGODB_URI);
const User = mongoose.model("User", {
  email: String,
  username: String,
  token: String,
  hash: String,
  salt: String,
});
const Comic = mongoose.model("Comic", {
  title: String,
  picture: Object,
  idComic: String,
});
const Character = mongoose.model("Character", {
  name: String,
  picture: Object,
  idCharacter: String,
});
// ------------------  -------------//
app.get("/", (req, res) => {
  res.status(200).json("Welcom to the marvel's backend");
});
app.get("/comics", async (req, res) => {
  try {
    let filters = "";
    const skip = (req.query.page - 1) * 100;

    if (req.query.title) {
      filters = filters + ("&title=" + req.query.title);
    }
    if (req.query.page) {
      filters = filters + ("&skip=" + skip);
    }
    const { data } = await axios.get(
      "https://lereacteur-marvel-api.herokuapp.com/comics?" +
        "apiKey=" +
        process.env.API_KEY +
        filters
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error.message);
  }
});
app.get("/comics/:characterid", async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://lereacteur-marvel-api.herokuapp.com/comics/" +
        req.params.characterid +
        "?apiKey=" +
        process.env.API_KEY
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error.message);
  }
});
app.get("/comic/:comicId", async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://lereacteur-marvel-api.herokuapp.com/comic/" +
        req.params.comicId +
        "?apiKey=" +
        process.env.API_KEY
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error.message);
  }
});
app.get("/characters", async (req, res) => {
  try {
    let filters = "";
    const skip = (req.query.page - 1) * 100;

    if (req.query.name) {
      filters = filters + ("&name=" + req.query.name);
    }
    if (req.query.page) {
      filters = filters + ("&skip=" + skip);
    }
    const { data } = await axios.get(
      "https://lereacteur-marvel-api.herokuapp.com/characters" +
        "?apiKey=" +
        process.env.API_KEY +
        filters
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error.message);
  }
});
app.get("/character/:characterId", async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://lereacteur-marvel-api.herokuapp.com/character/" +
        req.params.characterId +
        "?apiKey=" +
        process.env.API_KEY
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error.message);
  }
});
app.post("/signup", async (req, res) => {
  try {
    if (req.body.username && req.body.password && req.body.email) {
      if (await User.findOne({ email: req.body.email })) {
        return res.status(400).json({ message: "email is already registered" });
      } else {
        const salt = uid2(16);
        const token = uid2(32);
        const saltedPassword = req.body.password + salt;
        const hash = SHA256(saltedPassword);
        const readableHash = hash.toString(encBase64);
        const newUser = new User({
          email: req.body.email,
          token: token,
          hash: readableHash,
          salt: salt,
          username: req.body.username,
        });
        await newUser.save();
        res.status(201).json({
          _id: newUser._id,
          email: newUser.email,
          token: newUser.token,
          username: newUser.username,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post("/login", async (req, res) => {
  try {
    const userDoc = await User.findOne({ email: req.body.email });
    const hashConfirmation = SHA256(req.body.password + userDoc.salt).toString(
      encBase64
    );
    if (userDoc) {
      if (hashConfirmation === userDoc.hash) {
        res.status(200).json({
          _id: userDoc._id,
          token: userDoc.token,
          username: userDoc.username,
        });
      } else {
        res.status(401).json("Email or Password was not correct");
      }
    } else {
      res.status(401).json("Email or Password was not correct");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post("/favorite/character", async (req, res) => {
  try {
    const character = await Character.findOne({ idCharacter: req.body.id });
    if (character && req.body.name) {
      res.status(401).json("The character alredy exists in favorites");
    } else {
      const newCharacter = new Character({
        name: req.body.name,
        picture: req.body.picture,
        idCharacter: req.body.id,
      });
      await newCharacter.save();
      res.status(201).json({
        name: newCharacter.name,
        picture: newCharacter.picture,
        idCharacter: newCharacter.id,
        _id: newCharacter._id,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post("/favorite/comic", async (req, res) => {
  try {
    const comic = await Comic.findOne({ idComic: req.body.id });
    if (comic) {
      res.status(401).json("The comic alredy exists in favorites");
    } else {
      const newComic = new Comic({
        title: req.body.title,
        picture: req.body.picture,
        idComic: req.body.id,
      });
      await newComic.save();
      res.status(201).json({
        title: newComic.title,
        picture: newComic.picture,
        idComic: newComic.id,
        _id: newComic._id,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get("/favorite/list", async (req, res) => {
  try {
    const comic = await Comic.find();
    const character = await Character.find();
    res.status(200).json({
      comic: comic,
      character: character,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.delete("/favorite/delete/:id", async (req, res) => {
  try {
    if (await Comic.findById(req.params.id)) {
      await Comic.deleteOne({ _id: req.params.id });
      res.status(200).json("The comic has been deleted");
    } else {
    }
    if (await Character.findById(req.params.id)) {
      await Character.deleteOne({ _id: req.params.id });
      res.status(200).json("The character has been deleted");
    } else {
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.all("*", (req, res) => {
  res.status(400).json("Route not found");
});
app.listen(3000 || process.env.PORT, () => {
  console.log("Server started 🚀");
});
