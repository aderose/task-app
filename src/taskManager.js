import pubsub from "./pubsub";
import Task from "./Task";

const taskManager = (container) => {
  const _tasks = [];
  let taskId = 0;
  let taskToEdit = {};

  pubsub.subscribe("addTask", addTask);
  pubsub.subscribe("editTask", editTask);
  pubsub.subscribe("upcomingEditTask", prepareEditTask);
  pubsub.subscribe("removeTask", removeTask);

  function addTask(task) {
    _tasks.push(
      new Task(taskId++, task.title, task.datetime, task.priority, false)
    );
    renderTasks();
  }

  function prepareEditTask(task) {
    taskToEdit = task;
  }

  function editTask(taskInfo) {
    taskToEdit.title = taskInfo.title;
    taskToEdit.dueDate = taskInfo.datetime;
    taskToEdit.priority = taskInfo.priority;
  }

  function removeTask(task) {
    _tasks.splice(getTaskIndexById(task), 1);
    renderTasks();
  }

  const getTaskIndexById = (task) => _tasks.findIndex((x) => x.id === task.id);

  const renderTasks = () => {
    container.innerHTML = "";
    _tasks.forEach((task) => container.appendChild(task.element));
  };

  return { addTask, removeTask, renderTasks };
};

export default taskManager;
