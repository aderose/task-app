import pubsub from "./pubsub";

const taskManager = (doc) => {
  const _tasks = [];
  const _container = doc.querySelector("ul");

  pubsub.subscribe("addTask", addTask);

  const getTaskIndexById = (task) => _tasks.findIndex((x) => x.id === task.id);

  function addTask(task) {
    _tasks.push(task);
    renderTasks();
  }

  const removeTask = (task) => _tasks.splice(getTaskIndexById(task), 1);

  const renderTasks = () => {
    _container.innerHTML = "";
    _tasks.forEach((task) => _container.appendChild(makeTask(task)));
  };

  const makeTask = (task) => {
    const taskElement = makeElement("li", [
      "task",
      `${task.priority}-priority`,
    ]);
    const header = makeElement("div", ["task-header"]);
    const deadline = makeElement("div", ["deadline"], task.datetime);
    const controls = makeElement("div", ["controls"]);
    const edit = makeElement("button");
    const editImg = makeElement("i", ["far", "fa-edit"]);
    const trash = makeElement("button");
    const trashImg = makeElement("i", ["far", "fa-trash-alt"]);
    const taskText = makeElement("div", ["task-text"], task.title);

    edit.appendChild(editImg);
    trash.appendChild(trashImg);
    controls.appendChild(edit);
    controls.appendChild(trash);
    header.appendChild(deadline);
    header.appendChild(controls);
    taskElement.appendChild(header);
    taskElement.appendChild(taskText);

    return taskElement;
  };

  const makeElement = (name, classes, text) => {
    const element = doc.createElement(name);
    if (classes) classes.forEach((c) => element.classList.add(c));
    if (text) element.textContent = text;
    return element;
  };

  return { addTask, removeTask, renderTasks };
};

export default taskManager;
