const express = require('express');

const router = express.Router();
const db = require('../../server');

router.post('/createV2User', async (req, res) => {
  console.log('in create v2user Post Route');
  const dataJson = req.body;
  try {
    const createUser = await db.db.collection('v2_users').insertOne(dataJson);
    res.json(createUser);
    console.log(createUser);
  } catch (error) {
    console.log(error);
    res.json(error.messagge);
  }
});

router.get('/getAoiList', async (req, res) => {
  console.log('get aoi List');
  try {
    const result = await db.db.collection('aoiList').findOne();
    res.json(result);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
});

router.put('/updateV2User/:userId', async (req, res) => {
  console.log('in update v2user Route');
  const dataJson = req.body;
  try {
    const result = await db.db
      .collection('v2_users')
      .updateOne({ 'userInfo.userId': req.params.userId }, { $set: dataJson });
    res.json(result);
    console.log(result);
  } catch (error) {
    console.log(error);
    res.json(error.messagge);
  }
});

router.get('/getV2User', async (req, res) => {
  console.log('get v2 users');
  const { query } = req;
  console.log(query);
  try {
    const result = await db.db.collection('v2_users').findOne(query);
    res.json(result);
    // eslint-disable-next-line no-underscore-dangle
    console.log(result._id);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
