const mongoose = require("mongoose");
const everydayQuickTaskStatsSchema = mongoose.Schema({
  today: {
    type: Date,
  },
  accomplished: {
    quickTasks: {
      type: Number,
    },
    people: {
      type: Number,
    },
  },
  inProgress: {
    Number,
  },
});
module.exports = mongoose.model("stats", quickTaskStatsSchema);
