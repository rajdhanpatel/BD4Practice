//BD3Practice

const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3000;

let tasks = [
  { taskId: 1, text: 'Fix bug #101', priority: 2 },
  { taskId: 2, text: 'Implement feature #202', priority: 1 },
  { taskId: 3, text: 'Write documentation', priority: 3 },
];

// Endpoint 1. Add a Task to the Task List

app.get('/tasks/add', (req, res) => {
  let getTaskIdFromQueryParam = parseInt(req.query.taskId);
  let getTextFromQueryParam = req.query.text;
  let getPriorityFromQueryParam = parseInt(req.query.priority);

  let newObj = {
    taskId: getTaskIdFromQueryParam,
    text: getTextFromQueryParam,
    priority: getPriorityFromQueryParam,
  };
  tasks.push(newObj);
  res.json({ tasks: tasks });
});

//Endpoint 2. Read All Tasks in the Task List
app.get('/tasks', (req, res) => {
  res.json({ tasks: tasks });
});

//Endpoint 3. Sort Tasks by Priority
function sortAllByPriority(p1, p2) {
  return p1.priority - p2.priority;
}

app.get('/tasks/sort-by-priority', (req, res) => {
  let result = tasks.sort(sortAllByPriority);
  res.json({ tasks: result });
});

//Endpoint 4. Edit Task Priority
function findById(
  tasks,
  getPriorityFromQueryParam,
  obj,
  getTaskIdFromQueryParam
) {
  if (obj.taskId === getTaskIdFromQueryParam) {
    obj.priority = getPriorityFromQueryParam;
  }
  return tasks;
}
app.get('/tasks/edit-priority', (req, res) => {
  let getTaskIdFromQueryParam = parseInt(req.query.taskId);
  let getPriorityFromQueryParam = parseInt(req.query.priority);
  let updatedTasks = tasks.find((obj) =>
    findById(tasks, getPriorityFromQueryParam, obj, getTaskIdFromQueryParam)
  );
  res.json({ tasks: tasks });
});

//Endpoint 5. Edit/Update Task Text
let idFound = false;
function updateText(obj, getTaskIdFromQueryParam, getTextFromQueryParam) {
  if (obj.taskId === getTaskIdFromQueryParam) {
    obj.text = getTextFromQueryParam;
    idFound = true;
  }
}
app.get('/tasks/edit-text', (req, res) => {
  let getTaskIdFromQueryParam = parseInt(req.query.taskId);
  let getTextFromQueryParam = req.query.text;
  tasks.forEach((obj) => {
    updateText(obj, getTaskIdFromQueryParam, getTextFromQueryParam);
  });
  if (!idFound)
    res.status(400).json({ success: false, message: 'Id does not exist' });
  res.json({ tasks: tasks });
});

// Endpoint 6. Delete a Task from the Task List
function deleteRecordById(obj, getTaskIdFromQueryParam) {
  return obj.taskId != getTaskIdFromQueryParam;
}

app.get('/tasks/delete', (req, res) => {
  let getTaskIdFromQueryParam = parseInt(req.query.taskId);
  let UpdatedTask = tasks.filter((obj) =>
    deleteRecordById(obj, getTaskIdFromQueryParam)
  );
  res.json({ tasks: UpdatedTask });
});

//Endpoint 7. Filter Tasks by Priority

function getRecordByPriority(obj, getPriorityFromQueryParam) {
  return obj.priority === getPriorityFromQueryParam;
}

app.get('/tasks/filter-by-priority', (req, res) => {
  let getPriorityFromQueryParam = parseInt(req.query.priority);
  let UpdatedTask = tasks.filter((obj) =>
    getRecordByPriority(obj, getPriorityFromQueryParam)
  );
  res.json({ tasks: UpdatedTask });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
