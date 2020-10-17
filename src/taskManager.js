import pubsub from "./pubsub";
import Task from "./Task";

const taskManager = (doc) => {
  const _tasks = [];
  const _container = doc.querySelector("ul");

  pubsub.subscribe("addTask", addTask);

  const getTaskIndexById = (task) => _tasks.findIndex((x) => x.id === task.id);

  function addTask(newTask) {
    _tasks.push(
      new Task(
        _tasks.length,
        newTask.title,
        newTask.datetime,
        newTask.priority,
        false
      )
    );
    renderTasks();
  }

  const removeTask = (task) => _tasks.splice(getTaskIndexById(task), 1);

  const renderTasks = () => {
    _container.innerHTML = "";
    _tasks.forEach((task) => _container.appendChild(task.getElement(doc)));
  };

  return { addTask, removeTask, renderTasks };
};

export default taskManager;
