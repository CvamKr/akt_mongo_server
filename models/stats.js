const mongoose = require("mongoose");
const quickTaskStatsSchema = mongoose.Schema({
  overallStats: {
    accomplishedTasks: {
      type: Number,
    },
    numberOfAT: {
      type: Number,
    },
    numberOfUsers: {
      type: Number,
    },
  },
  everydayStats: {
    type: Array,
  },
});
module.exports = mongoose.model("stats", quickTaskStatsSchema);
