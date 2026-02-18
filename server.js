const express = require("express");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

let tasks = [
  { id: 1, title: "Learn Express", completed: false },
  { id: 2, title: "Build Task Manager API", completed: true },
];

let nextId = 3;

// ✅ GET /tasks (with optional filter)
app.get("/tasks", (req, res) => {
  const { completed } = req.query;

  if (completed === undefined) return res.json(tasks);

  const isCompleted = completed === "true";
  return res.json(tasks.filter((t) => t.completed === isCompleted));
});

// ✅ GET /tasks/:id
app.get("/tasks/:id", (req, res) => {
  const id = +req.params.id;
  const task = tasks.find((t) => t.id === id);

  if (!task) return res.status(404).json({ message: "Task not found" });

  res.json(task);
});

// ✅ POST /tasks
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title is required" });
  }

  const newTask = {
    id: nextId++,
    title,
    completed: false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// ✅ PUT /tasks/:id
app.put("/tasks/:id", (req, res) => {
  const id = +req.params.id;
  const task = tasks.find((t) => t.id === id);

  if (!task) return res.status(404).json({ message: "Task not found" });

  const { title, completed } = req.body;

  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;

  res.json(task);
});

// ✅ DELETE /tasks/:id
app.delete("/tasks/:id", (req, res) => {
  const id = +req.params.id;
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) return res.status(404).json({ message: "Task not found" });

  tasks.splice(index, 1);
  res.status(204).send();
});

app.listen(5000, () => {
  console.log("✅ Backend running on http://localhost:5000");
});