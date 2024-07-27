const express = require("express");

const axios = require("axios");
const router = express.Router();
router.get("/characters", async (req, res) => {
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
router.get("/character/:characterId", async (req, res) => {
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
module.exports = router;
