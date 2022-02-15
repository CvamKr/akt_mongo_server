const express = require('express');

const router = express.Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const ObjectId = require('mongodb').ObjectID;
const db = require('../../server');

router.post('/createGroup', async (req, res) => {
  console.log('in create group');
  // const dataJson = { "groupName": req.params.groupName, members: ["me"] };
  const dataJson = req.body;
  //  dataJson.onDate = Date.now();
  console.log(dataJson);
  try {
    const result = await db.db.collection('acGroup').insertOne(dataJson);
    res.json(result.ops[0]);
    console.log(result.ops[0]);
  } catch (error) {
    console.log(error);
  }
});

router.put('/updateGroup/:id', async (req, res) => {
  console.log('in update group');
  // const dataJson = { "groupName": req.params.groupName, members: ["me"] };
  const dataJson = req.body;
  console.log(dataJson);
  try {
    const result = await db.db
      .collection('acGroup')
      .updateOne({ _id: req.params.id }, dataJson);
    res.json(result.ops[0]);
    console.log(result.ops[0]);
  } catch (error) {
    console.log(error);
  }
});

router.get('/getAcGroup/:id', async (req, res) => {
  console.log('in get group');
  try {
    const result = await db.db
      .collection('acGroup')
      .findOne({ _id: ObjectId(req.params.id) });
    res.json(result);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
});

router.get('/getNumberOfGroups', async (req, res) => {
  console.log('in number of  groups');
  try {
    const result = await db.db.collection('acGroup').countDocuments();
    res.json(result);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
});

// For test
router.post('/createGroup2', async (req, res) => {
  console.log('in create group');
  // const dataJson = { "groupName": req.params.groupName, members: ["me"] };
  const dataJson = req.body;
  try {
    const result = await db.db.collection('notifAcGroup').insertOne(dataJson);
    res.json();
    console.log(result.ops[0]);
  } catch (error) {
    console.log(error);
  }
});

router.put('/joinGroupFromPost/:code/:memberLimit', async (req, res) => {
  console.log('in add user to group form post');
  const dataJson = req.body;
  console.log(dataJson);
  const { displayName } = dataJson.membersList.userInfo;
  const title = `${displayName} has just arrived!`;
  const body = ' Collaborate and cherish productivity together!';
  const view = 'member_joined';

  // var s =`membersList.${req.params.memberLimit}`.toString;
  // console.log(s);
  const query1 = {
    $and: [
      { _id: ObjectId(req.params.code) },
      // {membersList:{$lt:{$size:JSON.parse(req.params.memberLimit)}}},
      {
        $expr: {
          $lt: [{ $size: '$membersList' }, JSON.parse(req.params.memberLimit)],
        },
      },

      // this is working
      // { "membersList.1":{$exists:false}},

      // JSON.parse(req.query)
      // req.query
    ],
  };

  console.log(query1);

  // eslint-disable-next-line max-len
  // var query ={$and:[{_id: ObjectId(req.params.code)},{$nor:[{memberList:{$size:parseInt(req.params.memberLimit)}}]}]};
  console.log(req.params.memberLimit);
  // send notif on joining
  console.log('Sending Notif to Topic : ', req.params.code);

  try {
    const result = await db.db
      .collection('acGroup')
      .updateOne(query1, { $push: dataJson });
    res.json(result);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
});

// router.get("/getAcGroupTres/:memberLimit", async (req, res) => {
//   console.log("in get group");
//     var query =
//       { "memberList.1":{$exists:false}};

//   try {
//     const result = await db.db
//       .collection("acGroup")
//       .find(query);
//     res.json(result);
//     console.log(result);
//   } catch (error) {
//     console.log(error);
//   }
// });

router.put('/joinGroup/:code', async (req, res) => {
  console.log('in add user to group');
  const dataJson = req.body;
  console.log(dataJson);
  const { displayName } = dataJson.membersList.userInfo;
  console.log(displayName);
  const title = `${displayName} has just arrived!`;
  const body = ' Collaborate and cherish productivity together!';
  const view = 'member_joined';

  try {
    // send notif on joining
    console.log('Sending Notif to Topic : ', req.params.code);


    const result = await db.db
      .collection('acGroup')
      .updateOne({ _id: ObjectId(req.params.code) }, { $push: dataJson });
    res.json(result);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
});

// for test
router.post('/joinGroup2/:code', async (req, res) => {
  console.log('in add user to group');
  const dataJson = req.body;
  const { displayName } = dataJson;
  console.log(displayName);
  const title = 'New member arrived!';
  const body = `${displayName} has just joined. Cherish productivity together!`;
  const view = 'new_member';
  // const registrationTokens = [];
  // const topic = "";
  try {

    
    const result = await db.db
      .collection('notifAcGroup')
      .updateOne({ _id: ObjectId(req.params.code) }, { $push: dataJson });
    res.json(result);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
});
router.post('/createGroupV2/:id1/:id2/:id3/:name', async (req, res) => {
  console.log('in create group');
  try {
    const result = await db.db.collection('v2_acGroup').insertOne({
      members: [
        { id: req.params.id1, name: req.params.name },
        { id: req.params.id2, name: req.params.name },
        { id: req.params.id3, name: req.params.name },
      ],
    });
    res.json(result);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
});

router.get('/getRelevantGroups', async (req, res) => {
  console.log('getRelevantGroups');
  // query ={"tags": {"\$in": aoiList}}
  const { query } = req;
  try {
    const result = await db.db.collection('acGroup').find(query).toArray();
    res.json(result);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
});

router.get('/getUserGroups/:userId', async (req, res) => {
  console.log('insinde get Ac Groups');
  const query = { 'membersList.userInfo.userId': req.params.userId };
  try {
    const result = await db.db.collection('acGroup').find(query).toArray();
    res.json(result);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
});

router.post('/sendNotificationRequest', async (req, res) => {
  console.log('in send notif request');
  // const dataJson = { "groupName": req.params.groupName, members: ["me"] };
  const dataJson = req.body;
  const title = `${dataJson.senderName} sent a message in ${dataJson.acGroupName}`;
  const body = dataJson.message;
  const groupCode = dataJson.acGroupId;

  const view = 'chat_msg';
  console.log(dataJson);
  try {
    res.json('Chat Notification Sent');
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
