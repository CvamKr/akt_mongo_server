const express = require("express");
const router = express.Router();
const db = require("../../server");
const ObjectId = require("mongodb").ObjectID;

router.post("/createPost", async (req, res) => {
  console.log("in create post");
  const dataJson = req.body;
  try {
    const result = await db.db.collection("v2_posts").insertOne(dataJson);
    res.json(result);
    console.log(result.ops[0]);
  } catch (error) {
    console.log(error);
  }
});

router.put("/updatePostComments/:postId", async (req, res) => {
  console.log("in update post");
  const dataJson = req.body;
  try {
    const result = await db.db
      .collection("v2_posts")
      .updateOne({ _id: ObjectId(req.params.postId) }, dataJson);
    res.json(result);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
});

router.put("/updatePost/:acGroupId", async (req, res) => {
  console.log("in update post");
  const dataJson = req.body;
  var query = {
    $and: [req.query, { acGroupId: req.params.acGroupId }],
  };
  try {
    const result = await db.db
      .collection("v2_posts")
      .updateOne(query, { $set: dataJson });
    res.json(result);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
});

router.get("/getPosts/:id/:postedOn", async (req, res) => {
  console.log("getPosts");

  let query;

  if (req.params.postedOn == 1 && req.params.id == 1) {
    console.log("if");
    //root query
    query = req.query;
  } else {
    console.log("else");
    //pagination query
    query = {
      $and: [
        req.query,
        {
          $or: [
            { "details.postedOn": { $lt: req.params.postedOn } },
            {
              "details.postedOn": req.params.postedOn,
              _id: { $lt: ObjectId(req.params.id) },
            },
          ],
        },
      ],
    };
  }
  try {
    const result = await db.db
      .collection("v2_posts")
      .find(query)
      .sort({ _id: -1 })
      .limit(5)
      .toArray();
    res.json(result);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
});

router.get("/getRelevantInvites/:id/:postedOn", async (req, res) => {
  console.log("getRelevantInvites");
  let query;
  if (req.params.postedOn == 1 && req.params.id == 1) {
    console.log("if");
    //root query
    query = { $and: [{ memberLimitReached: false }, req.query] };
  } else {
    console.log("else");
    //pagination query
    query = {
      $and: [
        { $and: [{ memberLimitReached: false }, req.query] },
        {
          $or: [
            { "details.postedOn": { $lt: req.params.postedOn } },
            {
              "details.postedOn": req.params.postedOn,
              _id: { $lt: ObjectId(req.params.id) },
            },
          ],
        },
      ],
    };
  }
  try {
    const result = await db.db
      .collection("v2_posts")
      .find(query)
      .sort({ _id: -1 })
      .limit(5)
      .toArray();
    res.json(result);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
