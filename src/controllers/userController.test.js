const User = require("../models/User");
const userController = require("../controllers/userController");
const bcrypt = require("bcryptjs");

jest.mock("../models/User");
jest.mock("bcryptjs");

describe("User Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should return 400 if user validation fails", async () => {
      User.validateUser = jest.fn().mockReturnValue({
        error: { details: [{ message: "Validation error" }] },
      });
      req.body = { email: "test@example.com", password: "123456" };

      await userController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: "Validation error" });
    });

    it("should return 400 if user already exists", async () => {
      User.validateUser = jest.fn().mockReturnValue({ error: null });
      User.findOne.mockResolvedValue({ email: "test@example.com" });
      req.body = { email: "test@example.com", password: "123456" };

      await userController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: "User already exists" });
    });

    it("should return 201 and register user successfully", async () => {
        
    //   User.validateUser = jest.fn().mockReturnValue({ error: null });
    //   User.findOne.mockResolvedValue(null);
    //   bcrypt.genSalt.mockResolvedValue("salt");
    //   bcrypt.hash.mockResolvedValue("hashedPassword");

    //   //   const user = new User("Full Name", "test@example.com", "123456");
    //   const saveMethod = jest
    //     .spyOn(User.prototype, "save")
    //     .mockResolvedValueOnce({
    //       id: 1,
    //       username: "test",
    //       password: "hashed_password",
    //       displayName: "test_name",
    //     });
    //   //   user.save = jest
    //   //     .fn()
    //   //     .mockResolvedValue({ msg: "User registered successfully", user });

    //   const mockRequest = {};

    //   const mockResponse = {
    //     sendStatus: jest.fn(),
    //     send: jest.fn(),
    //     status: jest.fn(() => mockResponse),
    //   };

    //   await userController.registerUser(mockRequest, mockResponse);

    //   expect(mockResponse.status).toHaveBeenCalledWith(201);
    //   expect(User).toHaveBeenCalledWith({
    //     username: "test",
    //     password: "hashed_password",
    //     displayName: "test_name",
    //   });
      //   expect(mockResponse.send).toHaveBeenCalledWith(
      //     expect.objectContaining({
      //       msg: "User registered successfully",
      //       user: expect.objectContaining({
      //         fullName: "Full Name",
      //         email: "test@example.com",
      //       }),
      //     })
      //   );
    });

    it("should return 500 on server error", async () => {
      User.validateUser = jest.fn().mockReturnValue({ error: null });
      User.findOne.mockRejectedValue(new Error("Server error"));

      await userController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Server error");
    });
  });

  describe("getUserById", () => {
    it("should return 404 if user not found", async () => {
      User.findById.mockResolvedValue(null);
      req.params.id = "userId";

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: "User not found" });
    });

    it("should return user if found", async () => {
      User.findById.mockResolvedValue({
        _id: "userId",
        fullName: "Full Name",
        email: "test@example.com",
      });
      req.params.id = "userId";

      await userController.getUserById(req, res);

      expect(res.json).toHaveBeenCalledWith({
        fullName: "Full Name",
        email: "test@example.com",
      });
    });

    it("should return 500 on server error", async () => {
      User.findById.mockRejectedValue(new Error("Server error"));
      req.params.id = "userId";

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Server error");
    });
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      User.find.mockResolvedValue([
        { fullName: "Full Name", email: "test@example.com" },
      ]);

      await userController.getAllUsers(req, res);

      expect(res.json).toHaveBeenCalledWith([
        { fullName: "Full Name", email: "test@example.com" },
      ]);
    });

    it("should return 500 on server error", async () => {
      User.find.mockRejectedValue(new Error("Server error"));

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Server error");
    });
  });

  describe("updateUser", () => {
    it("should return 404 if user not found", async () => {
      User.findByIdAndUpdate.mockResolvedValue(null);
      req.params.id = "userId";
      req.body = { fullName: "New Full Name" };

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: "User not found" });
    });

    it("should return 200 and update user successfully", async () => {
      User.findByIdAndUpdate.mockResolvedValue({
        _id: "userId",
        fullName: "New Full Name",
        email: "test@example.com",
      });
      req.params.id = "userId";
      req.body = { fullName: "New Full Name" };

      await userController.updateUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        msg: "User updated successfully",
        user: {
          _id: "userId",
          fullName: "New Full Name",
          email: "test@example.com",
        },
      });
    });

    it("should return 500 on server error", async () => {
      User.findByIdAndUpdate.mockRejectedValue(new Error("Server error"));
      req.params.id = "userId";
      req.body = { fullName: "New Full Name" };

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Server error");
    });
  });

  describe("deleteUser", () => {
    it("should return 404 if user not found", async () => {
      User.findById.mockResolvedValue(null);
      req.params.id = "userId";

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: "User not found" });
    });

    it("should return 200 and delete user successfully", async () => {
      User.findById.mockResolvedValue({
        _id: "userId",
        fullName: "Full Name",
        email: "test@example.com",
      });
      User.deleteOne.mockResolvedValue({ deletedCount: 1 });
      req.params.id = "userId";

      await userController.deleteUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        msg: "User deleted successfully",
        user: {
          _id: "userId",
          fullName: "Full Name",
          email: "test@example.com",
        },
      });
    });

    it("should return 500 on server error", async () => {
      User.findById.mockRejectedValue(new Error("Server error"));
      req.params.id = "userId";

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Server error");
    });
  });
});
