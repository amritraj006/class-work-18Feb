import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/tasks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchTasks = async () => {
    const url = filter === "all" ? API : `${API}?completed=${filter}`;
    const res = await axios.get(url);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const addTask = async () => {
    if (!title.trim()) return;

    await axios.post(API, { title });
    setTitle("");
    fetchTasks();
  };

  const toggleTask = async (task) => {
    await axios.put(`${API}/${task.id}`, { completed: !task.completed });
    fetchTasks();
  };

  const editTask = async (task) => {
    const newTitle = prompt("New title:", task.title);
    if (!newTitle?.trim()) return;

    await axios.put(`${API}/${task.id}`, { title: newTitle });
    fetchTasks();
  };

  const removeTask = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchTasks();
  };

  return (
    <div>
      <h2>Task Manager</h2>

      {/* Add Task */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task..."
      />
      <button onClick={addTask}>Add</button>

      <br />
      <br />

      {/* Filter */}
      <label>Filter: </label>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="true">Completed</option>
        <option value="false">Pending</option>
      </select>

      <br />
      <br />

      {/* Task List */}
      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id}>
            <p>
              {task.title} - {task.completed ? "✅ Completed" : "❌ Pending"}
            </p>

            <button onClick={() => toggleTask(task)}>
              {task.completed ? "Undo" : "Done"}
            </button>

            <button onClick={() => editTask(task)}>Edit</button>

            <button onClick={() => removeTask(task.id)}>Delete</button>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}