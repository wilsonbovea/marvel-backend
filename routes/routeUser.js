const express = require("express");

const User = require("../models/user/user");
const uid2 = require("uid2");
const { SHA256 } = require("crypto-js");
const encBase64 = require("crypto-js/enc-base64");

const router = express.Router();

router.post("/signup", async (req, res) => {
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
router.post("/login", async (req, res) => {
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
module.exports = router;
