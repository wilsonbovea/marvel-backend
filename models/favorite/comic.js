const mongoose = require("mongoose");
const Comic = mongoose.model("Comic", {
  title: String,
  picture: Object,
  idComic: String,
  token: String,
});
module.exports = Comic;
