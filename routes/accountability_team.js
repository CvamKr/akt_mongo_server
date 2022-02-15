const express = require("express");
// const { find } = require("../models/accountability_team_model");
const router = express.Router();
// const AccountabilityTeam = require("../models/accountability_team_model");
// const User = require("../models/user_model");
const db = require("../server");
// const { route } = require("./user");
// const ObjectId = require("mongodb").ObjectID;
const ObjectId = require("mongodb").ObjectID;

router.post(
  "/createAccountabilityTeam",
  updateToBlockUserWhoIsSearching,
  updateAvailableUsersToBlockThem,

  // getBlockedUsersUsingTempId
  // findAvailableUsers
  // blockFoundUsers,
  createAccountabilityTeam,
  updateUserAvailability
);

async function updateToBlockUserWhoIsSearching(req, res, next) {
  console.log(
    "============\n================\nin updateToBlockUserWhoIsSearching"
  );
  console.log("user who is searching");
  console.log(`${req.body.userSearchingForAcTeam.id}`);

  try {
    console.log("in try");

    const query = {
      id: req.body.userSearchingForAcTeam.id,
      accountabilityTeamId: { $in: ["want", "dontWant"] },
    };
    const dataToUpdate = { $set: { accountabilityTeamId: "forming" } };

    const result = await db.db
      .collection("users")
      .findOneAndUpdate(
        query,
        dataToUpdate,
        { returnOriginal: false },
        { projection: { accountabilityTeamId: 1 } }
      );

    if (result.value == null) {
      console.log("probably user's acteam already exist");
      // next1();
      fetchUserDocToGetAcTeamId(req.body.userSearchingForAcTeam.id, req, res);
    }
    // if (
    //   result.value.accountabilityTeam === "want" ||
    //   result.value.accountabilityTeam === "dontWant" ||
    //   result.value.accountabilityTeam === "forming"
    // )
    else {
      console.log("users acteam status updated to 'forming'");
      res.userSearchingForAcTeam = req.body.userSearchingForAcTeam;
      next();
    }

    // else {
    //   console.log("users acteam already exist");
    //   // next1();
    //   fetchUserDocToGetAcTeamId(req.body.userSearchingForAcTeam.id, req, res);

    //   // res.json({
    //   //   msg:
    //   //     "users acteam already exist.\nNow fetch the user doc in the client side to get the acTeam id",
    //   //   acTeamId: result.value.accountabilityTeam,
    //   // });
    // }

    // res.json(result);

    // if(result.nModified == 0){
    //   res.json({
    //     msg: "acTeam already formed!",
    //     acTeamId :

    // });
    // }

    // res.status(201).json({ docsModified: updatedUser.result.nModified });

    // console.log("users acteam status updated to 'forming'");
    // next();
  } catch (error) {
    res
      .status(400)
      .json({ errorWhileBlockingTheUserWhoIsSearching: error.message });
    console.log(error.message);
  }
  // }
}

async function fetchUserDocToGetAcTeamId(userId, req, res) {
  db.db
    .collection("users")
    .findOne(
      { id: userId },
      { projection: { accountabilityTeamId: 1, _id: 0 } },
      function (err, result) {
        if (err) {
          console.log("error while fetching userDoc");
          res.json({ "error while fetching userDoc": err.message });
        } else {
          console.log(result);
          res.json({
            msg: "probably user's acteam already exist",

            result,
          });
        }
      }
    );
}

// async fetchUserDoc(userId){

// }

// router.get("/findAvailableUsers", findAvailableUsers);

async function updateAvailableUsersToBlockThem(req, res, next) {
  console.log(
    "=================================\nin updateAvailableUsersWithTempIdToBlockThem"
  );
  // console.log(new ObjectId());

  try {
    // users = await User.find({ accountabilityTeam: "" }).limit(3);

    const query = {
      accountabilityTeamId: "want",
      id: { $ne: req.body.userSearchingForAcTeam.id },
    }; //want, don't want, found/dynamiId
    // const tempId = new ObjectId();
    // console.log("tempId");
    // console.log(tempId);
    const dataToUpdate = { $set: { accountabilityTeamId: "forming" } };
    const projectFields = { projection: { displayName: 1, id: 1, email: 1 } };

    let foundUsersList = [];
    let result;
    for (let i = 0; i < 2; i++) {
      console.log(`for loop  : ${i + 1}`);
      try {
        result = await db.db
          .collection("users")
          .findOneAndUpdate(query, dataToUpdate, projectFields, {
            returnOriginal: false,
          });
        // res.json(result);
        console.log(result);
      } catch (error) {
        console.log(`error: ${error}`);
        res.json({ msg: error.message });
      }

      if (i == 0 && result.value == null) {
        console.log(`in loop ${i + 1} No users available.`);
        // res.status(404).json("No users available");
        updateBackTheUserWhoWasSearching(
          req.body.userSearchingForAcTeam.id,
          req,
          res
        );
        break;

        // return;
      } else if (i == 1 && result.value == null) {
        console.log(
          "inside if(i==1) => the 1st available user was found, but need to Update back the previous found user and searchingUser 'accountabilityTeam' field to 'want'"
        );
        db.db.collection("users").updateMany(
          {
            id: {
              $in: [foundUsersList[0].id, res.userSearchingForAcTeam.id],
            },
          },
          { $set: { accountabilityTeamId: "want" } },
          function (err, resultt) {
            if (err) {
              console.log(`error while updateing back: ${err}`);
              res.json(err);
            } else {
              console.log(`nModified: ${resultt}`);
              res.status(404).json(
                {
                  msg: " the 1st available user was found, but need to Update back the previous found user's 'accountabilityTeam' field to 'want'",
                  result: resultt,
                }

                // msg: `${result.nModified} the user's availablity was reverted back to 'want'`,
              );
            }
          }
        );
        break;
      } else {
        //add the found users to the list.
        foundUsersList.push(result.value);
      }
    }
    if (result.value != null) {
      console.log("result.value is not null..proceeding ahead");
      // foundUsersList.push(result.value);
      foundUsersList.push(res.userSearchingForAcTeam);

      console.log("foundUsersDetails");
      console.log(foundUsersList);
      res.foundUsersList = foundUsersList;
      next();
    } else {
      console.log("result.value is null..not procedding ahead");
    }

    // res.json(foundUsersList);

    // let result = await db.db
    //   .collection("users")
    //   .updateMany(query, dataToUpdate);

    // if (
    //   // usersList.length == 0 || usersList == null
    //   result.nModified == 0
    // ) {
    //   console.log(
    //     `usersList.length = ${result.nModified} => Not enough users available. Min 2 users are required to form an accontability group`
    //   );
    //   // usersList.push(req.body.userSearchingForAcTeam);
    //   // console.log(usersList);

    //   // res.sendStatus(404);
    //   res
    //     .status(404)
    //     .send(
    //       `usersList.length = ${result.nModified} => Not enough users available. Min 2 users are required to form an accontability group`
    //     );
    //   res.end;

    //   // res.status(404).json({
    //   //   message: `usersList.length = ${usersList.length} => Not enough users available. Min 2 users are required to form an accontability group`,
    //   // }).end;
    // } else {
    //   // console.log(`usersList.length: ${result.length}`);
    //   // console.log(result);

    //   // //add the user who is searching for the accountability team.
    //   // result.push(req.body.userSearchingForAcTeam);
    //   // console.log("usersList.length after adding the userSearchingForAcTeam");
    //   // console.log(result.length);
    //   // console.log(result);

    //   // res.json(usersList);

    //   // res.foundUsers = result;
    //   res.tempId = tempId;
    //   console.log("tempId, assigned to found available users");
    //   console.log(tempId);
    //   next();
    // }
  } catch (e) {
    console.log(`error : ${e}`);
    return res.status(500).json({ messagess: e.message });
  }
}

async function updateBackTheUserWhoWasSearching(userId, req, res) {
  console.log("in updateBackTheUserWhoWasSearching");
  db.db.collection("users").updateMany(
    {
      id: userId,
    },
    { $set: { accountabilityTeamId: "want" } },
    function (err, result) {
      if (err) {
        console.log(`error while updateing back: ${err}`);
        res.json(err);
      } else {
        console.log(`result: ${result}`);
        res.status(404).json(
          {
            msg: "No user was found so for the user who was searching, need to change it back to want",
            result,
          }

          // msg: `${result.nModified} the user's availablity was reverted back to 'want'`,
        );
      }
    }
  );
}

async function createAccountabilityTeam(req, res, next) {
  console.log("in createAccountabilityTeam");
  // let user;
  // let memberDetails;
  // for (let i = 0; i < res.foundUsers.length; i++) {
  //   memberDetails[i] = {
  //     gender: res.foundUsers[i].gender,
  //     username: res.foundUsers[i].username,
  //   };
  // }
  // const accountabilityTeam = new AccountabilityTeam({
  //   members: res.foundUsers,
  //   noOfTasks: 1,
  // });
  try {
    // const newAccountabilityTeam = await accountabilityTeam.save();

    const data = { members: res.foundUsersList };
    const newAccountabilityTeam = await db.db
      .collection("accountabilityTeams")
      .insertOne(data);

    // res.status(201).json(newAccountabilityTeam);
    console.log("accountabilityTeam created!");
    console.log(newAccountabilityTeam.ops[0]);

    res.usersToUpdate = res.foundUsersList;
    res.acTeamId = newAccountabilityTeam.ops[0]._id;
    next();
  } catch (err) {
    res.status(400).json({ errorWhileCreatingAcTeam: err.message });
    console.log(err.message);
  }
}

async function updateUserAvailability(req, res) {
  console.log("in updateUserAvailability");
  console.log("res.acTeamId");

  console.log(res.acTeamId);

  console.log(`usersToUPdate length: ${res.usersToUpdate.length}`);

  // for (let i = 0; i < res.usersToUpdate.length; i++) {
  //   console.log(`in for loop: i = ${i}`);

  try {
    console.log("in try");
    // await User.updateOne(
    //   { username: res.usersToUpdate[i].username },
    //   { $set: { accountabilityTeam: "true" } }
    // );
    let usersIdsList = [];
    for (let i = 0; i < res.usersToUpdate.length; i++) {
      usersIdsList.push(res.usersToUpdate[i].id);
    }

    console.log("usersIdsList: ");
    console.log(usersIdsList);
    const query = { id: { $in: usersIdsList } };
    const dataToUpdate = { $set: { accountabilityTeamId: res.acTeamId } };

    const updatedUser = await db.db
      .collection("users")
      .updateMany(query, dataToUpdate);

    res.status(201).json({
      docsModified: updatedUser.result.nModified,
      acTeamId: res.acTeamId,
    });
    console.log("users updated");
  } catch (error) {
    res.status(400).json({ errorWhileUpatingUsersBack: error.message });
    console.log(error.message);
  }
  // }
}

// router.get("/getAccountabilityTeams", async (req, res) => {
//   let accountabilityTeam;
//   try {
//     accountabilityTeam = new AccountabilityTeam.find();
//     res.json(accountabilityTeam);
//   } catch (err) {
//     res.status(400).json({ msg: err });
//   }
// });

router.get("/getAccountabilityTeamByUserId/:userId", async (req, res) => {
  console.log("in getAccountabilityTeamByUserId");
  // const query = { accountabilityTeam: { userId: req.params.userId } };

  const query = { "members.id": req.params.userId };

  try {
    const accountabilityTeam = await db.db
      .collection("accountabilityTeams")
      .findOne(query);

    if (accountabilityTeam == null) {
      res.status(404).json({ msg: "No Acteam not found for this user" });
    } else {
      res.json(accountabilityTeam);
    }
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

router.get("/getAccountabilityTeamByAcTeamId/:acTeamId", async (req, res) => {
  console.log("in getAccountabilityTeamByAcTeamId");
  // const query = { accountabilityTeam: { userId: req.params.userId } };

  const query = { _id: ObjectId(req.params.acTeamId) };

  try {
    const accountabilityTeam = await db.db
      .collection("accountabilityTeams")
      .findOne(query);

    if (accountabilityTeam == null) {
      res.status(404).json({ msg: "No Acteam not found for this user" });
    } else {
      res.json(accountabilityTeam);
    }
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

// {
//           $inc: {
//             "members.$[i].goalsAccomplishedCount": dataJson.operator,
//           },
//         },

router.put("/updateStatsForIndividuals/:docId/:userId", async (req, res) => {
  console.log("in update doc with Array Filters");
  var docId = req.params.docId;
  // const addOrSubtract = req.params.AddOrSubtract;
  console.log(req.params.id);
  const dataJson = req.body;
  const query = { _id: ObjectId(docId) };
  try {
    const updatedStats = await db.db
      .collection("accountabilityTeams")
      .updateOne(query, dataJson, {
        arrayFilters: [
          {
            "i.id": req.params.userId,
          },
        ],
      });
    res.json(updatedStats);
    console.log(updatedStats);
  } catch (error) {
    console.log(error);
    res.json(error.message);
  }
});
router.put("/removeMemberFromAcTeam/:acTeamId/:userId", async (req, res) => {
  console.log("in remove member  Post Route");
  try {
    const removeMemberFromAcTeam = await db.db
      .collection("accountabilityTeams")
      .updateOne(
        { _id: ObjectId(req.params.acTeamId) },
        {
          $pull: {
            members: { id: req.params.userId },
          },
        }
      );
    res.json(removeMemberFromAcTeam);
    console.log(removeMemberFromAcTeam);
  } catch (error) {
    console.log(error);
    res.json(error.messagge);
  }
});

module.exports = router;
