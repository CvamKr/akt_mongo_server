const express = require("express");
const router = express.Router();
const db = require("../server");
const ObjectId = require("mongodb").ObjectID;

router.post("/createGoal/:topicName", createGoal, updateGoalIdToAcTeamDb);

async function createGoal(req, res, next) {
  console.log("in create goal");
  const dataJson = req.body;
  const displayName = dataJson.by.displayName;
  try {
    const createdGoal = await db.db.collection("goals").insertOne(dataJson);
    console.log(createdGoal.ops[0]);
    res.goalId = createdGoal.ops[0]._id;
    res.acTeamId = dataJson.acTeamId;
    res.userId = dataJson.by.userId;
    next();
  } catch (error) {
    console.log(error);
    res.json(error.message);
  }
}

router.post("/addActionPlan/:_id", async (req, res) => {
  console.log("in update goal");
  const dataJson = req.body;
  dataJson._id = ObjectId();
  try {
    const updatedGoal = await db.db.collection("goals").UpdateOne(
      { _id: ObjectId("600fbd66479b0d15706f33f5") },
      {
        $addToSet: {
          actionPlan: dataJson,
        },
      }
    );
    res.json(updatedGoal);
    console.log(updatedGoal);
  } catch (error) {
    console.log(error);
  }
});

router.put("/updateActionPlan/:_id", async (req, res) => {
  console.log("in update goal");
  // const dataJson = req.body;
  try {
    const updatedGoal = await db.db.collection("goals").updateOne(
      {
        _id: ObjectId("600fbd66479b0d15706f33f5"),
        "actionPlan._id": ObjectId("60166a57ae362221b8aec47c"),
      },
      {
        $set: {
          "actionPlan.$.action": "newwDatata",
          "actionPlan.$.isPrivate": "",
          "actionPlan.$.duration": "newwDatata",
          "actionPlan.$.repeats": "newwDatata",
          "actionPlan.$.status": "newwDatata",
          "actionPlan.$.start": [{ sdfsf: "asdf" }],
          "actionPlan.$.end": [
            {
              asfdds: "adsfas",
            },
          ],
          "actionPlan.$.streak": "",
          "actionPlan.$.streakHistory": [{ newDATA: "asdfs" }],
        },
      }
      // {
      //   arrayFilters: [
      //     {
      //       "i._id": ObjectId("60164543ce8d6715b81e0294"),
      //     },
      //   ],
      // }
    );
    res.json(updatedGoal);
    console.log(updatedGoal);
  } catch (error) {
    console.log(error);
  }
});

router.get("/getGoal", async (req, res) => {
  console.log("in get Goal");
  try {
    const getGoal = await db.db.collection("goals").find();
    res.json(getGoal);
    console.log(getGoal);
  } catch (error) {
    console.log(error);
    res.json(error.message);
  }
});

// router.put("/postGoalIdToAcTeamDb/:acTeamId",async(req,res)=>{
//   console.log("posting goal id to act db");
//   // const dataJson = req.body;
//     const dataJson ={ "members.$.goalIds": req.body.goalIds};
//     console.log(dataJson);

//   try{
//     const postGoalIdToAcTeamDb = await db.db
//       .collection("accountabilityTeams")
//       .updateOne(
//         { _id: new ObjectId(req.params.acTeamId) },
//         {
//           $addToSet: { "members": req.body.goalIds },
//         },
//         // { arrayFilters: [{ element: 0 }], upsert: true }
//       );
//     res.json(postGoalIdToAcTeamDb);
//     console.log(postGoalIdToAcTeamDb);
//   } catch (error) {
//     console.log(error);
//     res.json(error.message);
//   }
// });

// Shailebhyanand, [29.01.21 21:33]
// router.put("/updateGoalIdToAcTeamDb/:acTeamId",);

async function updateGoalIdToAcTeamDb(req, res) {
  console.log("posting goal id to act db");
  // const dataJson = req.body;
  try {
    const postGoalIdToAcTeamDb = await db.db
      .collection("accountabilityTeams")
      .findOneAndUpdate(
        {
          _id: ObjectId(res.acTeamId),
        },
        {
          $push: {
            "members.$[i].goalIds": ObjectId(res.goalId),
          },
        },
        {
          arrayFilters: [
            {
              "i.id": res.userId,
            },
          ],
          upsert: true,
        }
      );
    // res.json(postGoalIdToAcTeamDb.value);
    res.json(res.goalId);

    console.log(postGoalIdToAcTeamDb);
  } catch (error) {
    console.log(error);
    res.json(error.message);
  }
}

router.put(
  "/deleteGoalIdFromAcTeam/:acTeamId/:goalId/:userId",
  async (req, res) => {
    console.log("in delete goal id from ac team db");
    const userId = req.params.userId;
    const goalId = req.params.goalId;
    const acTeamId = req.params.acTeamId;
    try {
      const postGoalIdToAcTeamDb = await db.db
        .collection("accountabilityTeams")
        .findOneAndUpdate(
          {
            _id: ObjectId(acTeamId),
          },
          {
            $pull: {
              "members.$[i].goalIds": ObjectId(goalId),
            },
          },
          {
            arrayFilters: [
              {
                "i.id": userId,
              },
            ],
          }
        );
      // res.json(postGoalIdToAcTeamDb.value);
      res.json(res.goalId);

      console.log(postGoalIdToAcTeamDb);
    } catch (error) {
      console.log(error);
      res.json(error.message);
    }
  }
);

router.get("/getGoalsOfAcTeamMembers", getAcTeamMembersGoals);
async function getAcTeamMembersGoals(req, res) {
  console.log("in getActeamMembersGoals..");
  const receivedGoalIds = req.query.goalIdsList;

  // let goalIdsList = [ObjectId("6015877227e1fa00179a8ab6")];
  let goalIdsList = [];
  console.log(`up typeof: ${typeof receivedGoalIds}`);
  console.log(`up length of receivedGoalIds: ${receivedGoalIds.length}`);

  if (typeof receivedGoalIds === "string") {
    // if(receivedGoalIds.length==1)
    console.log(`typeof: ${typeof receivedGoalIds}`);
    goalIdsList.push(ObjectId(receivedGoalIds));
  } else {
    for (let i = 0; i < receivedGoalIds.length; i++) {
      goalIdsList.push(ObjectId(receivedGoalIds[i]));
    }
  }

  const query = {
    _id: { $in: goalIdsList },
  };
  try {
    const result = await db.db
      .collection("goals")
      .find(query)
      .sort({ createdOn: -1 })
      .toArray();
    res.json(result);
  } catch (error) {
    res.json({ error: error.message });
  }
}

module.exports = router;

// db.collection("accountabilityTeams").updateOne(
//   {
//     _id: ObjectId(actId),
//   },
//   {
//     $push: {
//       "members.$[i].goalIds": ObjectId(goalId),
//     },
//   },
//   {
//     arrayFilters: [
//       {
//         "i.userId": ObjectId(userId),
//       },
//     ],
//   }
// );
