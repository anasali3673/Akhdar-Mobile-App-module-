const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  const { title, description, author, deadline } = req.body;

  const { error } = Task.validateTask(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  try {
    let task = await Task.create({
      title,
      description,
      author,
      deadline,
    });
    task = await task.populate("author");
    // await task.save();

    res.status(201).json({ msg: "Task created successfully", task });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getTaskById = async (req, res) => {
  const { id } = req.body;
  try {
    const task = await Task.findById(id).populate("author");
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, author, deadline } = req.body;

  try {
    let task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (author) task.author = author;
    if (deadline) task.deadline = deadline;

    await task.save();
    res.json({ msg: "Task updated successfully", task });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    await Task.deleteOne({ _id: id });
    res.json({ msg: "Task deleted successfully", task });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
