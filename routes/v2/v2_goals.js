/* eslint-disable max-len */
const express = require('express');

const router = express.Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const ObjectId = require('mongodb').ObjectID;
const db = require('../../server');

router.post('/createGoal', async (req, res) => {
  console.log('in create goal');
  const dataJson = req.body;
  dataJson.membersJoined[0].onDate = new Date();

  const { displayName } = dataJson.membersJoined[0].userInfo;
  // console.log(displayName);
  const title = `${displayName} just created a Goal !`;
  const body = "Checkout your Accountability Partner's goal and be inspired! ";
  const view = 'accountability_group';
  const topic = String(dataJson.accountabilityGroupId);
  console.log(topic);
  try {
    const result = await db.db.collection('v2_goals').insertOne(dataJson);
    res.json(result.ops[0]);
    console.log(result.ops[0]);
    if (result.result.n !== 0) {
      const result1 = await db.db.collection('acGroup').updateOne(
        {
          // _id:ObjectId(req.body["id"])
          _id: ObjectId(dataJson.accountabilityGroupId),
        },
        {
          $inc: { totalGoalsCreated: 1, 'membersList.$[i].totalGoalsCreated': 1 },
        },
        { arrayFilters: [{ 'i.userInfo.userId': dataJson.membersJoined[0].userInfo.userId }] },
      );
      console.log(result1);
    }
    console.log('sending Notif');
  } catch (error) {
    console.log(error);
  }
});

// eslint-disable-next-line max-len
// edit goal route if multiple members dont allow to edit the goal and if single member then allow edit
// report goal  route
router.put('/editGoal/:goalId', async (req, res) => {
  console.log('edit Goal Route entered');
  const dataJson = req.body;
  if (dataJson.memberListLength === 1) {
    try {
      const dbRes = await db.db.collection('v2_goals').updateOne({ _id: req.params.goalId }, dataJson.goalInfo);
      res.json(dbRes);
      console.log('sending Notif');
    } catch (error) {
      console.log(error);
    }
  }
});
// Report Goal
router.post('/reportGoal', async (req, res) => {
  console.log('Report Goal Route entered');
  const dataJson = req.body;

  try {
    const dbRes = await db.db.collection('reported_goals').insertOne(dataJson);
    res.json(dbRes);
    console.log(dbRes);
  } catch (error) {
    console.log(error);
  }
});

router.put('/updateGoalStatus/:goalId/:userId', async (req, res) => {
  console.log('in goal Update Route');
  //  data received
  const dataJson = req.body;
  let accomplishedByAll = false;
  try {
    //  use array filters  and result ===dbRes
    const dbRes = await db.db
      .collection('v2_goals')
      .findOneAndUpdate(
        { _id: ObjectId(req.params.goalId) },
        { $set: { 'membersJoined.$[i].status': dataJson.status } },
        { new: true, arrayFilters: [{ 'i.userInfo.userId': req.params.userId }] },
      );
    // res.json(dbRes); // decide on when to send response
    console.log(dbRes);
    if (dbRes.lastErrorObject.n !== 0) {
      const dbRes1 = await db.db.collection('acGroup').updateOne(
        {
          _id: ObjectId(dataJson.accountabilityGroupId),
        },

        {
          $inc: {
            // totalGoalsAccomplished: 1,
            'membersList.$[i].totalGoalsAccomplished':
                dataJson.status === 'accomplished' ? 1 : -1,
          },
        },
        { arrayFilters: [{ 'i.userInfo.userId': req.params.userId }] },
      );
      console.log(dbRes1);

      if (dbRes.value.membersJoined.length > 1) {
        // eslint-disable-next-line no-restricted-syntax
        for (const member of dbRes.membersJoined) {
          if (member.status === 'notStarted') {
            accomplishedByAll = false;
            break;
          } else if (member.status === 'accomplished') {
            accomplishedByAll = true;
          }
        }
      } else if (dataJson.status === 'accomplished') {
        accomplishedByAll = true;
      }

      // eslint-disable-next-line eqeqeq
      // eslint-disable-next-line quotes
      const dbRes2 = await db.db.collection("acGroup").updateOne(
        {
          _id: ObjectId(dataJson.accountabilityGroupId),
        },

        {
          $inc: {
            totalGoalsAccomplished: accomplishedByAll ? 1 : -1,
          },
        },
      );
      console.log(dbRes2);
      // eslint-disable-next-line max-len
      res.json({
        goalUpdate: dbRes.lastErrorObject.n,
        memberStatusUpdate: dbRes1.result.n,
        groupStatusUpdate: dbRes2.result.n,
      });
    }
  } catch (error) {
    console.log(error);
    res.json(error.messagge);
  }
});

router.put('/addRemMember/:goalId/:userId/:func/:goalStatus', async (req, res) => {
  console.log('in goal addMember Route');
  const dataJson = req.body;
  dataJson.onDate = new Date();
  const { func } = req.params;
  let data = {};
  if (func === 'addMember') {
    data = { $addToSet: { membersJoined: dataJson } };
  } else {
    data = {
      $pull: {
        'membersJoined.userInfo.userId': req.params.userId,
      },
    };
    // filter = [{ 'i.userInfo.userId': req.params.userId }];
    // filter = [{ 'i.h': 'hello' }];
  }
  console.log(func);
  console.log(data);
  console.log(req.params.goalId);
  try {
    const dbRes = await db.db.collection('v2_goals').updateOne(
      // use array filters
      // when somenone joins a particular goal in acGroup col decresase the total goals accoplished if goal accomplished change goal status and decrease the total goals accomplished count if goal is not accomplished nothing changes add goals status parameter in add Rem memberr
      { _id: ObjectId(req.params.goalId) },
      data,
      // { arrayFilters: filter },
    );
    // console.log(dbRes.value.title);
    // res.json(dbRes);
    console.log(dbRes);
    if (dbRes.result.n !== 0) {
      const dbRes1 = await db.db.collection('acGroup').updateOne(
        {
          _id: ObjectId(dataJson.accountabilityGroupId),
        },
        {
          $inc: {
            'membersList.$[i].totalGoalsCreated': func === 'addMember' ? 1 : -1,
          },
        },
        { arrayFilters: [{ 'i.userInfo.userId': req.params.userId }] },
      );
      console.log(dbRes1);
      // rea=send response ;
      res.json({
        goalUpdate: dbRes.result.n,
        countChanged: dbRes1.result.n,
      });
    }
  } catch (error) {
    console.log(error);
    res.json(error.messagge);
  }
});

router.post('/deleteGoal/:goalId', async (req, res) => {
  console.log('in deleteGoal Post Route');
  const dataJson = req.body;
  if (dataJson.memberListLength === 1) {
    try {
      const result = await db.db
        .collection('v2_goals')
        .deleteOne({ _id: ObjectId(req.params.goalId) });
      res.json(result);
      console.log(result);
    } catch (error) {
      console.log(error);
      res.json(error.messagge);
    }
  }
});

// router.get(
//   "/getGoalsWithPagination/:acGroupId/:userId/:goalId/:createdOn",
//   async (req, res) => {
//     console.log("in getGoalsWithPagination");
//     let id1 = req.params.goalId;

//     // let query ={
//     //              _id: { $gt: ObjectId(id1)}};
//     let query;
//     //  let createdOn = JSON.parse(req.params.createdOn);
//     const createdOn = req.params.createdOn;
//     console.log(createdOn);
//     console.log(id1);

//     if (createdOn === 1 && id1 == 1) {
//       console.log("if");
//       //root query
//       query = {
//         accountabilityGroupId: req.params.acGroupId,
//         "membersJoined.userInfo.userId": req.params.userId,
//       };
//     } else {
//       console.log("else");
//       //pagination query
//       query = {
//         $and: [
//           {
//             accountabilityGroupId: req.params.acGroupId,
//             "membersJoined.userInfo.userId": req.params.userId,
//           },
//           {
//             $or: [
//               { createdOn: { $gt: createdOn } },
//               {
//                 createdOn: createdOn,
//                 _id: { $gt: ObjectId(id1) },
//               },
//             ],
//           },
//         ],
//       };
//     }

//     try {
//       const result = await db.db
//         .collection("v2_goals")
//         .find(query)
//         .limit(5)
//         .toArray();
//       console.log(result);
//       res.json(result);
//     } catch (e) {
//       res.json({ msg: e.msg });
//     }
//   }
// );
router.get(
  '/getGoalsWithPagination/:acGroupId/:userId/:goalId/:createdOn',
  async (req, res) => {
    console.log('in getGoalsWithPagination');
    const id1 = req.params.goalId;

    // let query ={
    //              _id: { $gt: ObjectId(id1)}};
    let query;
    //  let createdOn = JSON.parse(req.params.createdOn);
    const { createdOn } = req.params;
    console.log(createdOn);
    console.log(id1);

    if (createdOn === 1 && id1 === 1) {
      console.log('if');
      // root query
      query = {
        accountabilityGroupId: req.params.acGroupId,
        'membersJoined.userInfo.userId': req.params.userId,
      };
    } else {
      console.log('else');
      // pagination query
      query = {
        $and: [
          {
            accountabilityGroupId: req.params.acGroupId,
            'membersJoined.userInfo.userId': req.params.userId,
          },
          {
            $or: [
              { createdOn: { $lt: createdOn } },
              {
                createdOn,
                _id: { $lt: ObjectId(id1) },
              },
            ],
          },
        ],
      };
    }

    try {
      const result = await db.db
        .collection('v2_goals')
        .find(query)
        .sort({ _id: -1 })
        .limit(5)
        .toArray();
      console.log(result);
      res.json(result);
    } catch (e) {
      res.json({ msg: e.msg });
    }
  },
);

router.get(
  '/getGroupGoalsWithPagination/:acGroupId/:goalId/:createdOn',
  async (req, res) => {
    console.log('in getGoalsWithPagination');
    const id1 = req.params.goalId;

    // let query ={
    //              _id: { $gt: ObjectId(id1)}};
    let query;
    //  let createdOn = JSON.parse(req.params.createdOn);
    const { createdOn } = req.params;
    console.log(createdOn);
    console.log(id1);

    if (createdOn === 1 && id1 === 1) {
      console.log('if');
      // root query
      query = {
        accountabilityGroupId: req.params.acGroupId,
      };
    } else {
      console.log('else');
      // pagination query
      query = {
        $and: [
          {
            accountabilityGroupId: req.params.acGroupId,
          },
          {
            $or: [
              { createdOn: { $lt: createdOn } },
              {
                createdOn,
                _id: { $lt: ObjectId(id1) },
              },
            ],
          },
        ],
      };
    }

    try {
      const result = await db.db
        .collection('v2_goals')
        .find(query)
        .sort({ _id: -1 })
        .limit(5)
        .toArray();
      console.log(result);
      res.json(result);
    } catch (e) {
      res.json({ msg: e.msg });
    }
  },
);
router.get('/getGoals/:acGroupId/:userId', async (req, res) => {
  console.log('in getGoals');
  const query = {
    accountabilityGroupId: req.params.acGroupId,
    'membersJoined.userInfo.userId': req.params.userId,
  };
  try {
    const result = await db.db.collection('v2_goals').find(query).toArray();
    res.json(result);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
});

router.get('/getUserGoals/:userId', async (req, res) => {
  console.log('in getGoals');
  const query = {
    'membersJoined.userInfo.userId': req.params.userId,
  };
  try {
    const result = await db.db.collection('v2_goals').find(query).toArray();
    res.json(result);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
});

router.get('/getNumberOfAccomplishedGoals', async (req, res) => {
  console.log('in getnumver of accomplished Goals');
  const query = {
    'membersJoined.status': 'accomplished',
  };
  try {
    const result = await db.db.collection('v2_goals').countDocuments(query);
    res.json(result);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
});

router.get('/getGoalsForGroup/:groupId', async (req, res) => {
  console.log('in in get goals for Group');
  const query = { accountabilityGroupId: req.params.groupId };
  try {
    const result = await db.db.collection('v2_goals').find(query).toArray();
    res.json(result);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
});

router.put(
  '/accomplishGoal/:goalId/:userId/:accountabilityGroupId/:displayName',
  async (req, res) => {
    console.log('in accomplish goal');
    const dataJson = {
      $set: { 'membersJoined.$.status': 'accomplished' },
    };
    const query = {
      _id: ObjectId(req.params.goalId),
      'membersJoined.userInfo.userId': req.params.userId,
    };

    const { displayName } = req.params;
    console.log(displayName);
    const title = `${displayName} just accomplished a Goal !`;
    const body = 'Your Accountability Partner just progressed, keep progressing!';
    const view = 'accountability_group';
    const topic = req.params.accountabilityGroupId;
    console.log(topic);

    try {
      const result = await db.db
        .collection('v2_goals')
        .updateOne(query, dataJson);
      res.json(result);
      console.log(result);
      console.log('sending Notif');
    } catch (error) {
      console.log(error);
    }
  },
);

module.exports = router;
