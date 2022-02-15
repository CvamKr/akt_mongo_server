const express = require("express");
const router = express.Router();
const UserModel = require("../models/user_model");
const db = require("../server");
// const ObjectId = require("mongodb").ObjectID;
const ObjectId = require("mongodb").ObjectID;

// router.post("/createUser", async (req, res) => {
//   const user = new UserModel({
//     username: req.body.username,
//     gender: req.body.gender,
//     accountabilityTeam: req.body.accountabilityTeam,
//     bio: req.body.bio,
//     photoUrl: req.body.photoUrl,
//     joinedOn: req.body.joinedOn,
//     id: req.body.id,
//     age: req.body.age,
//     email: req.body.email,
//   });

//   try {
//     const newUser = await user.save();
//     res.status(201).json(newUser);
//   } catch (error) {
//     res.status(400).json({ msg: error });
//   }
// });

// router.post("/updateUser", async (req, res) => {
//   const user = new UserModel({
//     username: req.body.username,
//     gender: req.body.gender,
//     accountabilityTeam: req.body.accountabilityTeam,
//     bio: req.body.bio,
//     photoUrl: req.body.photoUrl,
//     joinedOn: req.body.joinedOn,
//     id: req.body.id,
//     age: req.body.age,
//     email: req.body.email,
//   });
//   try {
//     const newUser = await user.updateOne(
//       {
//         id: req.body.id,
//       },
//       {
//         $set: {
//           username: req.body.username,
//         },
//       },
//       {}
//     );
//     res.status(201).json(newUser);
//   } catch (error) {
//     res.status(400).json({ msg: error });
//   }
// });

router.put("/updateDisplayName/:id", async (req, res) => {
  console.log("in update displayName Post Route");
  const dataJson = req.body;
  console.log(req.params.id);
  try {
    const updatedDisplayName = await db.db.collection("users").updateOne(
      { id: req.params.id },
      {
        $set: {
          displayName: dataJson.displayName,
        },
      }
    );
    res.json(updatedDisplayName);
    console.log(updatedDisplayName);
  } catch (error) {
    console.log(error);
    res.json(error.messagge);
  }
});

router.put("/updateDisplayNameInAcTeam/:acTeamId/:userId", async (req, res) => {
  console.log("in update display naem from ac team db");
  const acTeamId = req.params.acTeamId;
  const userId = req.params.userId;
  try {
    const postUpdatedDisplayNameToAcTeamDb = await db.db
      .collection("accountabilityTeams")
      .updateOne(
        {
          _id: ObjectId(acTeamId),
        },
        {
          $set: {
            "members.$[i].displayName": req.body.displayName,
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
    // res.json(res.goalId);
    res.json(postUpdatedDisplayNameToAcTeamDb);
    console.log(postUpdatedDisplayNameToAcTeamDb);
  } catch (error) {
    console.log(error);
    res.json(error.message);
  }
});

router.post("/createUser/", async (req, res) => {
  console.log("in update Username Post Route");
  const dataJson = req.body;
  try {
    const createUser = await db.db.collection("users").insertOne(dataJson);
    res.json(createUser);
    console.log(createUser);
  } catch (error) {
    console.log(error);
    res.json(error.messagge);
  }
});
// router.post("/updateUsername", async (req, res) => {
//   const user = new UserModel({
//     username: req.body.username,
//     gender: req.body.gender,
//     accountabilityTeam: req.body.accountabilityTeam,
//     bio: req.body.bio,
//     photoUrl: req.body.photoUrl,
//     joinedOn: req.body.joinedOn,
//     id: req.body.id,
//     age: req.body.age,
//     email: req.body.email,
//   });
//   try {
//     const newUser = await user.findOne({ id: req.body.id });
//     const update = { username: req.body.username };
//     await newUser.updateOne(update);
//     res.status(201).json(newUser);
//   } catch (error) {
//     res.status(400).json({ msg: error });
//   }
// });
router.get("/getUserById/:id", getUserById, async (req, res) => {
  res.json(res.user);
});

async function getUserById(req, res, next) {
  let user;
  try {
    // user = await UserModel.findOne({ id: req.params.id });
    const query = { id: req.params.id };
    user = await db.db.collection("users").findOne(query);
    if (user == null) {
      console.log("user doesn't exist in db");
      res.status(404).json({ mgs: "User doesn't exists in db" });
    } else {
      console.log(`user exist in db: user is:  ${user}`);
      console.log(user);
      res.user = user;
      next();
    }
    // else{

    // }
    // res.json(user);
  } catch (e) {
    console.log("error sent");
    res.status(500).json({ msg: e.message });
  }
}

router.put("/updateAccoutabilityTeamStatus/:id", async (req, res) => {
  console.log("in update accountabilityTeamStatus Post Route");
  const dataJson = req.body;
  try {
    const updateUser = await db.db.collection("users").updateOne(
      { id: req.params.id },
      {
        $set: {
          "accountabilityTeam.availableForActTeam":
            dataJson.accountabilityTeam.availableForActTeam,
          "accountabilityTeam.accountabilityTeamId":
            dataJson.accountabilityTeam.accountabilityTeamId,
        },
      }
    );
    res.json(updateUser);
    console.log(updateUser);
  } catch (error) {
    console.log(error);
    res.json(error.messagge);
  }
});

router.post("/create100Users", async (req, res) => {
  for (let i = 1001; i < 1006; i++) {
    console.log(`i = ${i}`);
    const user = new UserModel({
      username: `user ${i}`,

      accountabilityTeam: "",
    });

    try {
      // let newUser =
      await user.save();
      // res.json(newUser);
      console.log(`user created is ${i}`);
    } catch (error) {
      res.status(400).json({ msg: error });
    }
  }
  // res.json({ msg: "new users created!" });
});

module.exports = router;
