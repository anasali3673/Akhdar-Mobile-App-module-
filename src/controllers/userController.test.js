const request = require("supertest");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
describe("POST /register", () => {
  it("should register a new user", async () => {
    const userData = {
      fullName: "nawaz",
      email: "test@example.com",
      password: "password123",
    };

    User.findOne = jest.fn().mockResolvedValue(null);

    bcrypt.genSalt = jest.fn().mockResolvedValue("salt");
    bcrypt.hash = jest.fn().mockResolvedValue("hashedPassword");

    expect(res.body.msg).toBe("User registered successfully");
    expect(res.body.user.fullName).toBe(userData.fullName);
    expect(res.body.user.email).toBe(userData.email);
    expect(res.body.user).toHaveProperty("id");

    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, "salt");
  });

  it("should return 400 if user already exists", async () => {
    const userData = {
      fullName: "ali",
      email: "ali@example.com",
      password: "password456",
    };
  });
});
