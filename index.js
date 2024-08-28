const fs = require("fs");

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { Schema } = mongoose;
app.use(express.json());

//schema
const taskSchema = new Schema({
  taskName: { type: String, required: true },
  isDeleted: { type: Boolean, required: true },
  specificTime: { type: Date, default: Date.now },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
const Task = mongoose.model("Task", taskSchema);

//db connection
main().catch(() => console.log());

async function main() {
  await mongoose.connect("mongodb://localhost:27017/todo");

  console.log("db connected");
}

//API

//C R U D//
//createTask
const createTodo = async (req, res) => {
  const todos = new Task(req.body);
  await todos
    .save()
    .then((doc) => {
      res.status(201).json(doc);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

//readAllTask
const getAllTodos = async (req, res) => {
  const todos = await Task.find();
  res.json(todos);
};  

//readOneTask
const getOneTodo = async (req, res) => {
  const todos = await Task.findById(req.params.id);
  res.json(todos);
};

//updateTask
const updateTodo = async (req, res) => {
  const todos = await Task.findByIdAndUpdate(req.params.id, req.body);
  res.json(todos);
};

// deleteoneTask
const deleteTodos = async (req, res) => {
  const todos = await Task.findOneAndDelete({isDeleted: true, ...req.body});
  res.json(todos);
};

//deleteAllTask
const deleteAllTodos = async (req, res) => {
  const todos = await Task.deleteMany(req.params.id);
  res.json(todos);
};

app.post("/todos", createTodo);
app.get("/todos", getAllTodos);
app.get("/todos/:id", getOneTodo);
app.put("/todos/:id", updateTodo);
app.post("/todos/:id", deleteTodos);
app.delete("/todos", deleteAllTodos);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
