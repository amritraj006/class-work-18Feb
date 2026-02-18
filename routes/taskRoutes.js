import express from 'express'
const router = express.Router();

let tasks = [
  { id: 1, title: "Learn Express", completed: false },
  { id: 2, title: "Build Task Manager API", completed: true },
];

let nextId = 3;

router.get("/", (req, res) => {
  const { completed } = req.query;

  if (completed === undefined) return res.json(tasks);

  const isCompleted = completed === "true";
  return res.json(tasks.filter((t) => t.completed === isCompleted));
});


router.get("/:id", (req, res) => {
  const id = +req.params.id;
  const task = tasks.find((t) => t.id === id);

  if (!task) return res.status(404).json({ message: "Task not found" });

  res.json(task);
});


router.post("/", (req, res) => {
  const { title } = req.body;

  if (!title) return res.status(400).json({ message: "Title is required" });

  const newTask = { id: nextId++, title, completed: false };
  tasks.push(newTask);

  res.status(201).json(newTask);
});

router.put("/:id", (req, res) => {
  const id = +req.params.id;
  const task = tasks.find((t) => t.id === id);

  if (!task) return res.status(404).json({ message: "Task not found" });

  if (req.body.title !== undefined) task.title = req.body.title;
  if (req.body.completed !== undefined) task.completed = req.body.completed;

  res.json(task);
});

router.delete("/:id", (req, res) => {
  const id = +req.params.id;
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) return res.status(404).json({ message: "Task not found" });

  tasks.splice(index, 1);
  res.status(204).send();
});

export default router;
