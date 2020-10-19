import pubsub from "./pubsub";
import Task from "./Task";

const taskManager = (container) => {
  const _tasks = [];
  let taskId = 0;

  // subscribe to all the task change events
  pubsub.subscribe("addTask", addTask);
  pubsub.subscribe("editTask", editTask);
  pubsub.subscribe("removeTask", removeTask);

  // add a new task to the task list then render the list
  function addTask(task) {
    _tasks.push(
      new Task(taskId++, task.title, task.datetime, task.priority, false)
    );
    renderTasks();
  }

  // update taskToEdit variable with edit info from form
  function editTask({ taskId, taskInfo }) {
    const task = getTaskById(taskId);
    task.title = taskInfo.title;
    task.dueDate = taskInfo.datetime;
    task.priority = taskInfo.priority;
  }

  // remove the provided task from the task list then re-render the list
  function removeTask(task) {
    _tasks.splice(getTaskIndexById(task), 1);
    renderTasks();
  }

  // get task list index of the provided task
  const getTaskIndexById = (task) => _tasks.findIndex((x) => x.id === task.id);

  // get task given a taskId
  const getTaskById = (taskId) => _tasks.reduce((x) => x.id === taskId);

  // render the task list by appending it to the provided container
  const renderTasks = () => {
    container.innerHTML = "";
    _tasks.forEach((task) => container.appendChild(task.element));
  };

  return { addTask, removeTask, renderTasks };
};

export default taskManager;
