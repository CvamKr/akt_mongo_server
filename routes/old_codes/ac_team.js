// async function findAndBlockAvailableUsers(req, res, next) {
//   console.log("in findAndBlockAvailableUsers");
//   // console.log(new ObjectId());

//   try {
//     // users = await User.find({ accountabilityTeam: "" }).limit(3);
//     const query = {
//       accountabilityTeam: "want",
//       id: { $ne: req.body.userSearchingForAcTeam.id },
//     }; //want, don't want, found/dynamiId
//     const tempId = new ObjectId();
//     console.log("tempId");
//     console.log(tempId);
//     const dataToUpdate = { accountabilityTeam: "forming" };

//     let result = await db.db
//       .collection("users")
//       .updateMany(query, dataToUpdate);

//     if (
//       // usersList.length == 0 || usersList == null
//       result.nModified == 0
//     ) {
//       console.log(
//         `usersList.length = ${result.nModified} => Not enough users available. Min 2 users are required to form an accontability group`
//       );
//       // usersList.push(req.body.userSearchingForAcTeam);
//       // console.log(usersList);

//       // res.sendStatus(404);
//       res
//         .status(404)
//         .send(
//           `usersList.length = ${result.nModified} => Not enough users available. Min 2 users are required to form an accontability group`
//         );
//       res.end;

//       // res.status(404).json({
//       //   message: `usersList.length = ${usersList.length} => Not enough users available. Min 2 users are required to form an accontability group`,
//       // }).end;
//     } else {
//       // console.log(`usersList.length: ${result.length}`);
//       // console.log(result);

//       // //add the user who is searching for the accountability team.
//       // result.push(req.body.userSearchingForAcTeam);
//       // console.log("usersList.length after adding the userSearchingForAcTeam");
//       // console.log(result.length);
//       // console.log(result);

//       // res.json(usersList);

//       // res.foundUsers = result;
//       res.tempId = tempId;
//       console.log("tempId, assigned to found available users");
//       console.log(tempId);
//       next();
//     }
//   } catch (e) {
//     console.log(`error : ${e}`);
//     return res.status(500).json({ messagess: e.message });
//   }
// }

// async function getDetailsOfFoundUsersUsingTempId(req, res, next) {
//   console.log("in getDetailsOfFoundUsersUsingTempId");
//   // console.log(new ObjectId());

//   try {
//     // users = await User.find({ accountabilityTeam: "" }).limit(3);
//     const query = {
//       accountabilityTeam: res.tempId,
//     }; //want, don't want, found/dynamiId
//     const fields = { displayName: 1, id: 1, email: 1 };

//     let usersList = await db.db
//       .collection("users")
//       .find(query)
//       // .find({})
//       .project(fields)
//       .limit(2)
//       .toArray();

//     if (usersList.length == 0 || usersList == null) {
//       console.log(
//         `usersList.length = ${usersList.length} => Not enough users available. Min 2 users are required to form an accontability group`
//       );
//       // usersList.push(req.body.userSearchingForAcTeam);
//       // console.log(usersList);

//       // res.sendStatus(404);
//       res
//         .status(404)
//         .send(
//           `usersList.length = ${usersList.length} => Not enough users available. Min 2 users are required to form an accontability group`
//         );
//       res.end;

//       // res.status(404).json({
//       //   message: `usersList.length = ${usersList.length} => Not enough users available. Min 2 users are required to form an accontability group`,
//       // }).end;
//     } else {
//       console.log(`usersList.length: ${usersList.length}`);
//       console.log(usersList);

//       //add the user who is searching for the accountability team.
//       usersList.push(req.body.userSearchingForAcTeam);
//       console.log("usersList.length after adding the userSearchingForAcTeam");
//       console.log(usersList.length);
//       console.log(usersList);

//       // res.json(usersList);

//       res.foundUsers = usersList;
//       next();
//     }
//   } catch (e) {
//     console.log(`error : ${e}`);
//     return res.status(500).json({ messagess: e.message });
//   }
// }

// async function findAndBlockAvailableUsersAtTheSameTime(req, res, next) {
//   console.log("in findAvailableUsers");
//   // console.log(new ObjectId());

//   try {
//     // users = await User.find({ accountabilityTeam: "" }).limit(3);
//     const query = {
//       accountabilityTeam: "want",
//       id: { $ne: req.body.userSearchingForAcTeam.id },
//     }; //want, don't want, found/dynamiId
//     const fields = { displayName: 1, id: 1, email: 1 };

//     db.db.collection("users").find(query).project(fields).limit(2);
//     // .forEach(funtion(doc){
//     //   doc.accountabilityTeam = "forming";

//     // });

//     let usersList = await db.db
//       .collection("users")
//       .find(query)
//       // .find({})
//       .project(fields)
//       .limit(2)
//       .toArray();

//     if (usersList.length == 0 || usersList == null) {
//       console.log(
//         `usersList.length = ${usersList.length} => Not enough users available. Min 2 users are required to form an accontability group`
//       );
//       // usersList.push(req.body.userSearchingForAcTeam);
//       // console.log(usersList);

//       // res.sendStatus(404);
//       res
//         .status(404)
//         .send(
//           `usersList.length = ${usersList.length} => Not enough users available. Min 2 users are required to form an accontability group`
//         );
//       res.end;

//       // res.status(404).json({
//       //   message: `usersList.length = ${usersList.length} => Not enough users available. Min 2 users are required to form an accontability group`,
//       // }).end;
//     } else {
//       console.log(`usersList.length: ${usersList.length}`);
//       console.log(usersList);

//       //add the user who is searching for the accountability team.
//       usersList.push(req.body.userSearchingForAcTeam);
//       console.log("usersList.length after adding the userSearchingForAcTeam");
//       console.log(usersList.length);
//       console.log(usersList);

//       // res.json(usersList);

//       res.foundUsers = usersList;
//       next();
//     }
//   } catch (e) {
//     console.log(`error : ${e}`);
//     return res.status(500).json({ messagess: e.message });
//   }
// }

// async function findAvailableUsers(req, res, next) {
//   console.log("in findAvailableUsers");
//   // console.log(new ObjectId());

//   try {
//     // users = await User.find({ accountabilityTeam: "" }).limit(3);
//     const query = {
//       accountabilityTeam: "want",
//       id: { $ne: req.body.userSearchingForAcTeam.id },
//     }; //want, don't want, found/dynamiId
//     const fields = { displayName: 1, id: 1, email: 1 };

//     let usersList = await db.db
//       .collection("users")
//       .find(query)
//       // .find({})
//       .project(fields)
//       .limit(2)
//       .toArray();

//     if (usersList.length == 0 || usersList == null) {
//       console.log(
//         `usersList.length = ${usersList.length} => Not enough users available. Min 2 users are required to form an accontability group`
//       );
//       // usersList.push(req.body.userSearchingForAcTeam);
//       // console.log(usersList);

//       // res.sendStatus(404);
//       res
//         .status(404)
//         .send(
//           `usersList.length = ${usersList.length} => Not enough users available. Min 2 users are required to form an accontability group`
//         );
//       res.end;

//       // res.status(404).json({
//       //   message: `usersList.length = ${usersList.length} => Not enough users available. Min 2 users are required to form an accontability group`,
//       // }).end;
//     } else {
//       console.log(`usersList.length: ${usersList.length}`);
//       console.log(usersList);

//       //add the user who is searching for the accountability team.
//       usersList.push(req.body.userSearchingForAcTeam);
//       console.log("usersList.length after adding the userSearchingForAcTeam");
//       console.log(usersList.length);
//       console.log(usersList);

//       // res.json(usersList);

//       res.foundUsers = usersList;
//       next();
//     }
//   } catch (e) {
//     console.log(`error : ${e}`);
//     return res.status(500).json({ messagess: e.message });
//   }
// }

// async function blockFoundUsers(req, res) {
//   console.log("in blockUblockFoundUsersserWhoIsSearching");
//   console.log("user who is searching");
//   console.log(`${req.body.userSearchingForAcTeam.id}`);

//   try {
//     console.log("in try");
//     // await User.updateOne(
//     //   { username: res.usersToUpdate[i].username },
//     //   { $set: { accountabilityTeam: "true" } }
//     // );

//     const query = { id: req.body.userSearchingForAcTeam.id };
//     const dataToUpdate = { $set: { accountabilityTeam: "forming" } };

//     const updatedUser = await db.db
//       .collection("users")
//       .updateMany(query, dataToUpdate);

//     res.status(201).json({ docsModified: updatedUser.result.nModified });
//     console.log("users updated");
//   } catch (error) {
//     res.status(400).json({ msg: error.message });
//     console.log(error.message);
//   }
//   // }
// }
