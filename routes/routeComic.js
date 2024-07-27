const express = require("express");

const axios = require("axios");
const router = express.Router();
router.get("/comics", async (req, res) => {
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
router.get("/comics/:characterid", async (req, res) => {
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
router.get("/comic/:comicId", async (req, res) => {
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
module.exports = router;
