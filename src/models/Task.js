const mongoose = require("mongoose");
const Joi = require("joi");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  deadline: { type: Date, required: true },
});

const taskJoiSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  author: Joi.string().min(3).max(50).required(),
  deadline: Joi.date().greater("now").required(),
});

TaskSchema.statics.validateTask = function (taskData) {
  return taskJoiSchema.validate(taskData);
};

module.exports = mongoose.model("Task", TaskSchema);
