import pubsub from "./pubsub";
import Task from "./Task";

const taskManager = (container) => {
  const _tasks = [];
  let taskId = 0;

  pubsub.subscribe("addTask", addTask);
  pubsub.subscribe("removeTask", removeTask);

  function addTask(task) {
    _tasks.push(
      new Task(taskId++, task.title, task.datetime, task.priority, false)
    );
    renderTasks();
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
