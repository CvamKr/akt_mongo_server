// const express = require("express");
// const router = express.Router();

// router.post("/dataCol", async (req, res) => {
//   console.log("in dataCol");
//   console.dir(`text: ${req.body}`);
//   try {
//     let newUser = await db
//       .collection("data")
//       .insertOne({ text: req.body.text });
//     res.status(201).json(newUser.ops);
//     console.log("data posted");
//   } catch (error) {
//     res.status(400).json({ msg: error });
//   }
// });
