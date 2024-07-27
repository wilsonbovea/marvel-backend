const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
// ------------------ mongodb -------------//
mongoose.connect(process.env.MONGODB_URI);

// ------------------  -------------//
app.get("/", (req, res) => {
  res.status(200).json("Welcom to the marvel's backend");
});
// ROUTES CHARACTER
const routeCharacter = require("./routes/routeCharacter");
app.use(routeCharacter);
const favoriteCharacter = require("./routes/favorite");
app.use(favoriteCharacter);
// ------------------------//

// ROUTES COMIC //
const routeComic = require("./routes/routeComic");
app.use(routeComic);
// ------------------//
// ROUTES USER
const routeUser = require("./routes/routeUser");
app.use(routeUser);
// -------------------//

app.all("*", (req, res) => {
  res.status(400).json("Route not found");
});
app.listen(3000 || process.env.PORT, () => {
  console.log("Server started 🚀");
});
