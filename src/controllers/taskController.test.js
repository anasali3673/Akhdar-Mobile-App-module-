const Task = require("../models/Task");
const {
  createTask,
  getTaskById,
  getAllTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

jest.mock("../models/Task");

describe("Task Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        title: "Sample Task",
        description: "This is a sample task",
        author: "60d21b4667d0d8992e610c85",
        deadline: "2024-12-31",
        id: "60d21b4667d0d8992e610c85",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    Task.validateTask.mockClear();
    Task.create.mockClear();
    Task.findById.mockClear();
    Task.find.mockClear();
    Task.findByIdAndUpdate.mockClear();
    Task.deleteOne.mockClear();
  });

  describe("createTask", () => {
    it("should return 400 if validation fails", async () => {
      Task.validateTask.mockReturnValue({
        error: { details: [{ message: "Validation failed" }] },
      });

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Validation failed",
      });
    });

    it("should create a task and populate the author field", async () => {
      Task.validateTask.mockReturnValue({ error: null });

      const createdTask = {
        _id: "60d21b4667d0d8992e610c85",
        title: "Sample Task",
        description: "This is a sample task",
        author: "60d21b4667d0d8992e610c85",
        deadline: "2024-12-31",
      };

      Task.create.mockResolvedValue(createdTask);
      Task.findById.mockResolvedValue({
        ...createdTask,
        author: { _id: "60d21b4667d0d8992e610c85", name: "Author Name" },
      });

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Task created successfully",
        task: expect.objectContaining({
          title: "Sample Task",
          description: "This is a sample task",
          author: expect.objectContaining({
            _id: "60d21b4667d0d8992e610c85",
            name: "Author Name",
          }),
          deadline: "2024-12-31",
        }),
      });
    });

    it("should return 500 if there is a server error", async () => {
      Task.validateTask.mockReturnValue({ error: null });

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Server error");
    });
  });
  describe("getAllTasks", () => {
    it("should return all tasks", async () => {
      const tasks = [
        {
          _id: "60d21b4667d0d8992e610c85",
          title: "Sample Task",
          description: "This is a sample task",
          author: { _id: "60d21b4667d0d8992e610c85", name: "Author Name" },
          deadline: "2024-12-31",
        },
      ];

      Task.find.mockResolvedValue(tasks);

      await getAllTasks(req, res);

      expect(res.json)
    });

    it("should return 500 if there is a server error", async () => {
      Task.find.mockRejectedValue(new Error("Server error"));

      await getAllTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Server error");
    });
  });
});
