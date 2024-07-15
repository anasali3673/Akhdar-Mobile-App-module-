const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  const { error } = User.validateUser(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({ fullName, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res
      .status(201)
      .json({
        msg: "User registered successfully",
        user: { fullName: user.fullName, email: user.email, id: user._id },
      });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({
      fullName: user.fullName,
      email: user.email,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName } = req.body;

  try {
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (fullName) user.fullName = fullName;

    await user.save();
    res.json({ msg: "User updated successfully", user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await User.deleteOne({ _id: id });
    res.json({ msg: "User deleted successfully", user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
