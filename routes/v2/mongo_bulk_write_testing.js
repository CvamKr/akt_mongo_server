const express = require("express");
const router = express.Router();
const db = require("../../server");
const ObjectId = require("mongodb").ObjectID;

// router.get("/getRelevantPosts",async(req,res)=>{
//   console.log("getRelevantPosts");
//   const query = req.body;
//   //The query format would be this
// //   {
// //       "tags": { "$in": ["orange", "apple", "plum", "banana"] }
// // }
//   try {
//     const result = await db.db.collection("v2posts").find(query).toArray();
//     res.json(result);
//     console.log(result.ops[0]);
//   } catch (error) {
//     console.log(error);
//   }
// });

router.post("/createV2Posts", async (req, res) => {
  console.log("createV2Posts");
  const dataJson = req.body;
  try {
    const result = await db.db.collection("v2posts").insertOne(dataJson);
    res.json(result);
    console.log(result.ops[0]);
  } catch (error) {
    console.log(error);
  }
});

router.post("/mongoBulkWrite", async (req, res) => {
  console.log("in report Post");
  const dataJson = req.body;
  dataJson._id = ObjectId();
  try {
    const reportedMsg = await db.db.collection("bulk_write_test").bulkWrite([
      {
        insertOne: {
          document: {
            _id: 4,
            char: "Dithras",
            class: "barbarian",
            lvl: 4,
          },
        },
      },
      {
        insertOne: {
          document: {
            _id: 5,
            char: "Taeln",
            class: "fighter",
            lvl: 3,
          },
        },
      },
      {
        updateOne: {
          filter: { char: "Eldon" },
          update: { $set: { status: "Critical Injury" } },
        },
      },
      {
        deleteOne: { filter: { char: "Brisbane" } },
      },
      {
        replaceOne: {
          filter: { char: "Meldane" },
          replacement: { char: "Tanys", class: "oracle", lvl: 4 },
        },
      },
    ]);
    res.json(reportedMsg);
    console.log(reportedMsg);
  } catch (error) {
    console.log(error);
  }
});

router.get("/pagination2/:height/:id", async (req, res) => {
  try {
    if ((req.params.height == 1, req.params.id == 1)) {
      const pagination2 = await db.db
        .collection("TestingUsers")
        .find()
        .sort({ height: 1, _id: 1 })
        .limit(3)
        .toArray();
      console.log(pagination2);
      res.json(pagination2);
    } else {
      const pagination2 = await db.db
        .collection("TestingUsers")
        .find({
          $or: [
            { height: { $gt: req.params.height } },
            {
              height: req.params.height,
              _id: { $gt: ObjectId(req.params.id) },
            },
          ],
        })
        .sort({ height: 1, _id: 1 })
        .limit(3)
        .toArray();
      console.log(pagination2);
      res.json(pagination2);
    }
  } catch (e) {
    res.json({ msg: e.msg });
  }
});

router.get("/pagination3/:height/:id", async (req, res) => {
  let query;
  let height1 = JSON.parse(req.params.height);
  let id1 = req.params.id;
  console.log(height1);
  console.log(id1);

  if (height1 == 1 && id1 == 1) {
    console.log("if");
    //root query
    query = { birth: { $gt: 1626009379127 } };
  } else {
    console.log("else");
    //pagination query
    query = {
      $and: [
        { birth: { $gt: 1626009379127 } },
        {
          $or: [
            { height: { $gt: height1 } },
            {
              height: height1,
              _id: { $gt: ObjectId(id1) },
            },
          ],
        },
      ],
    };
  }

  try {
    const pagination3 = await db.db
      .collection("TestingUsers")
      .find(query)
      .sort({ height: 1, _id: 1 })
      .limit(3)
      .toArray();
    console.log(pagination3);
    res.json(pagination3);
  } catch (e) {
    res.json({ msg: e.msg });
  }
});

router.get("/pagination4/:start/:id", async (req, res) => {
  let query;
  let start1 = JSON.parse(req.params.start);
  let id1 = req.params.id;
  console.log(start1);
  console.log(id1);

  if (start1 == 1 && id1 == 1) {
    console.log("if");
    //root query
    query = { deadline: 10 };
  } else {
    console.log("else");
    //pagination query
    query = {
      $and: [
        { deadline: 10 },
        {
          $or: [
            { start: { $gt: start1 } },
            {
              start: start1,
              _id: { $gt: ObjectId(id1) },
            },
          ],
        },
      ],
    };
  }

  try {
    const result = await db.db
      .collection("TestingGoals")
      .find(query)
      .sort({ start: 1, _id: 1 })
      .limit(3)
      .toArray();
    console.log(result);
    res.json(result);
  } catch (e) {
    res.json({ msg: e.msg });
  }
});

router.get("/pagination/:time", async (req, res) => {
  try {
    const query = { height: { $gt: "100" } }; //can be modified according to our req
    const sort = ["birth", -1]; //..

    //for the 1st page nextKeyfn can be removed .
    if (req.params.time == "1") {
      const { paginatedQuery, nextKeyFn } = generatePaginationQuery(
        query,
        sort
      );
      console.log("inside pagination");
      const users = await db.db
        .collection("TestingUsers")
        .find(paginatedQuery)
        .limit(5)
        .sort([sort])
        .toArray();
      var nextKey = nextKeyFn(users);
      console.log(nextKey);
      console.log(paginatedQuery);
      res.json(users);
    } else {
      const { paginatedQuery, nextKeyFn } = generatePaginationQuery(
        query,
        sort,
        nextKey
      );
      const users = await db.db
        .collection("TestingUsers")
        .find(paginatedQuery)
        .limit(3)
        .sort([sort])
        .toArray();
      nextKey = nextKeyFn(users);
      console.log(users);
      res.json(users);
    }
  } catch (e) {
    res.json({ msg: e.msg });
  }
});

//Function to turn a normal query to a pagination query
function generatePaginationQuery(query, sort, nextKey) {
  const sortField = sort == null ? null : sort[0];

  //nextKey is used as parameter to fetch next page
  function nextKeyFn(items) {
    if (items.length === 0) {
      return null;
    }
    //if nextKey function has data then it is processed here
    const item = items[items.length - 1];

    //_id is used as default sorting method if not specified
    if (sortField == null) {
      return { _id: item._id };
    }
    //returns data for next page
    return { _id: item._id, [sortField]: item[sortField] };
  }

  if (nextKey == null) {
    return { query, nextKeyFn };
  }

  let paginatedQuery = query;

  if (sort == null) {
    paginatedQuery._id = { $gt: nextKey._id };
    return { paginatedQuery, nextKey };
  }

  //we specify the type of sort in the parameter of this function
  const sortOperator = sort[1] === 1 ? "$gt" : "$lt";

  // sort is explicitly specified or not .....used accordingly
  const paginationQuery = [
    { [sortField]: { [sortOperator]: nextKey[sortField] } },
    {
      $and: [
        { [sortField]: nextKey[sortField] },
        { _id: { [sortOperator]: nextKey._id } },
      ],
    },
  ];

  if (paginatedQuery.$or == null) {
    paginatedQuery.$or = paginationQuery;
  } else {
    //both query and the sorting methods specified in pagintionqQuery are used
    paginatedQuery = { $and: [query, { $or: paginationQuery }] };
  }
  //Nextkeyfn would have data req. for the next page
  return { paginatedQuery, nextKeyFn };
}

// router.post("/create25Users", async (req, res) => {
//   try {
//     let list = [];
//     for (let i = 1; i <= 25; i++) {
//       function getRandomString(length) {
//         var randomChars =
//           "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
//         var result = "";
//         for (var i = 0; i < length; i++) {
//           result += randomChars.charAt(
//             Math.floor(Math.random() * randomChars.length)
//           );
//         }
//         return result;
//       }
//       // function getRandomHeight(length) {
//       //   var randomChars = "123";
//       //   var result = "";
//       //   for (var i = 0; i < length; i++) {
//       //     result += randomChars.charAt(
//       //       Math.floor(Math.random() * randomChars.length)
//       //     );
//       //   }
//       //   return result;
//       // }

//       let name = getRandomString(5);
//       //  let height = getRandomHeight(3);
//       let height = i;
//       let birth= new Date().getTime();
//       // function randomDate(start, end) {
//       //   return new Date(
//       //     start.getTime() + Math.random() * (end.getTime() - start.getTime())
//       //   );
//       // }

//       // let birth = randomDate(new Date(2012, 0, 1), new Date());
//       // let height = Math.floor(Math.random() * (3- 2 + 1)) + 2;

//       console.log(`i = ${i}`);
//       list.push({
//         name: name,
//         birth: birth,
//         height: height,
//       });
//       console.log(list);
//       // const user = await db.db.collection("TestingUsers")
//       // .insertOne(
//       //   {
//       //     "name" : name,
//       //     "birth" :birth,
//       //     "height" : height
//       //    }
//       // );
//       // console.log(user)
//       // res.json(user)
//     }

//     const user = await db.db.collection("TestingUsers").insertMany(list);
//     console.log(user);
//     res.json(user);
//   } catch (error) {
//     res.status(400).json({ msg: error });
//   }
//   // res.json({ msg: "new users created!" });
// });

module.exports = router;
