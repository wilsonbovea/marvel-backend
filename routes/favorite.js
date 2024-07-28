const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const Character = require("../models/favorite/character");
const Comic = require("../models/favorite/comic");
router.post("/favorite/characters", isAuthenticated, async (req, res) => {
  try {
    const character = await Character.findOne({ idCharacter: req.body.id });
    if (character && req.body.name) {
      res.status(401).json("The character alredy exists in favorites");
    } else {
      const newCharacter = new Character({
        name: req.body.name,
        picture: req.body.picture,
        idCharacter: req.body.id,
        token: req.body.token,
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
router.post("/favorite/comics", isAuthenticated, async (req, res) => {
  try {
    const comic = await Comic.findOne({ idComic: req.body.id });
    if (comic) {
      res.status(401).json("The comic alredy exists in favorites");
    } else {
      const newComic = new Comic({
        title: req.body.title,
        picture: req.body.picture,
        idComic: req.body.id,
        token: req.body.token,
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
router.get("/favorite/list", isAuthenticated, async (req, res) => {
  try {
    const comic = await Comic.find({ token: req.query.token });
    const character = await Character.find({ token: req.query.token });
    res.status(200).json({
      comic: comic,
      character: character,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete("/favorite/delete/:id", isAuthenticated, async (req, res) => {
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
module.exports = router;
