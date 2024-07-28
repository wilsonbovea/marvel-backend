const mongoose = require("mongoose");
const Character = mongoose.model("Character", {
  name: String,
  picture: Object,
  idCharacter: String,
  token: String,
});
module.exports = Character;
