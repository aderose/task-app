import pubsub from "./pubsub";
import Task from "./Task";

const taskManager = (doc) => {
  const _tasks = [];
  const _container = doc.querySelector("ul");

  pubsub.subscribe("addTask", addTask);

  function addTask(task) {
    _tasks.push(
      new Task(_tasks.length, task.title, task.datetime, task.priority, false)
    );
    renderTasks();
  }

  const getTaskIndexById = (task) => _tasks.findIndex((x) => x.id === task.id);
  const removeTask = (task) => _tasks.splice(getTaskIndexById(task), 1);

  const renderTasks = () => {
    _container.innerHTML = "";
    _tasks.forEach((task) => _container.appendChild(task.getElement()));
  };

  return { addTask, removeTask, renderTasks };
};

export default taskManager;
