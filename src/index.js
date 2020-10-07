import taskManager from "./taskManager.js";
import Task from "./Task.js";

const task = new Task(0, "", "", "", "Medium", false);

console.log(task);

taskManager.addTask(task);

console.log(taskManager.getTasks());

taskManager.removeTask(task);

console.log(taskManager.getTasks());
