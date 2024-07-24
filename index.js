const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json("Welcom to the marvel's backend");
});
app.get("/comics", async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://lereacteur-marvel-api.herokuapp.com/comics?" +
        process.env.API_KEY
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
app.get("*", (req, res) => {
  res.status(400).json("Route not found");
});
app.listen(3000, () => {
  console.log("Server started 🚀");
});
