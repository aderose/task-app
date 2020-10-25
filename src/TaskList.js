import Task from "./Task";
import pubsub from "./pubsub";
import tagFactory from "./tagFactory";

class TaskList {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.tasks = [];
    this.increment = 0;
    this.menuItem = this._createMenuItem();
    this.listenersActive = false;
    this.addMenuListeners();
  }

  // add functionality to this TaskList object
  activate() {
    this.subscriptions = this._subscribeToTaskEvents();
    this.tasks.forEach((task) => task.addEventListeners());
  }

  // remove functionality from this TaskList object
  deactivate() {
    // if the task list has no subscriptions, it musn't have been activated
    // yet and therefore will have no event listeners
    if (!this.subscriptions) return;
    this._unsubscribeFromTaskEvents(this.subscriptions);
    this.tasks.forEach((task) => task.removeEventListeners());
  }

  // remove this task list
  remove() {
    this.deactivate();
    this.removeMenuListeners();
    this.name = "";
    this.tasks = [];
  }

  // add a new task to the task list and render the result
  createTask(info) {
    const task = new Task(
      this.increment++,
      info.title,
      info.datetime,
      info.priority,
      false
    );
    this.tasks.push(task);
    task.addEventListeners();
    pubsub.publish("taskListUpdated");
  }

  // update the task associated with the given taskId with the new taskInfo
  updateTask(info) {
    const task = this._getTaskById(Number(info.id));
    task.title = info.title;
    task.dueDate = info.datetime;
    task.priority = info.priority;
  }

  // render the task list by appending it to the provided container
  deleteTask(task) {
    task.removeEventListeners();
    this.tasks = this.tasks.filter((t) => t !== task);
    pubsub.publish("taskListUpdated");
  }

  _createEditForm() {
    const container = tagFactory.createTag("form", {
      class: `update-list-form update-${this.id}`,
    });
    const input = tagFactory.createTag("input", {
      type: "text",
      class: "update-list-input",
      name: "list-name",
      id: this.id,
    });
    const submit = tagFactory.createTag("button", {
      type: "submit",
      class: "update-list-submit",
    });
    submit.appendChild(
      tagFactory.createTag("i", { class: "far fa-check-circle" })
    );

    container.appendChild(input);
    container.appendChild(submit);

    return { container, input, submit };
  }

  // create a menu itemm containing a delete and edit button
  _createMenuItem() {
    const container = tagFactory.createTag("li", { class: "list-entry" });
    const name = tagFactory.createTag("p", {}, this.name);
    const controls = tagFactory.createTag("div", { class: "controls" });
    const updateList = tagFactory.createTag("button");
    updateList.appendChild(tagFactory.createTag("i", { class: "far fa-edit" }));
    const deleteList = tagFactory.createTag("button");
    deleteList.appendChild(
      tagFactory.createTag("i", { class: "far fa-trash-alt" })
    );
    const form = this._createEditForm();

    controls.appendChild(updateList);
    controls.appendChild(deleteList);
    container.appendChild(name);
    container.appendChild(controls);

    return { container, name, updateList, deleteList, form, controls };
  }

  updateMenuItem(type) {
    this.menuItem.container.innerHTML = "";
    if (type === "form") {
      this.menuItem.container.appendChild(this.menuItem.form.container);
    } else {
      this.menuItem.container.appendChild(this.menuItem.name);
      this.menuItem.container.appendChild(this.menuItem.controls);
    }
  }

  addMenuListeners() {
    if (this.listenersActive) return;
    // publish a menuItemSelected event when the menuItem is clicked
    pubsub.publish("createEventListener", {
      element: this.menuItem.container,
      type: "click",
      fn: () => pubsub.publish("menuItemSelected", this),
    });

    pubsub.publish("createEventListener", {
      element: this.menuItem.updateList,
      type: "click",
      fn: (e) => {
        pubsub.publish("updateTaskList", this);
        e.stopPropagation();
      },
    });

    pubsub.publish("createEventListener", {
      element: this.menuItem.deleteList,
      type: "click",
      fn: (e) => {
        pubsub.publish("deleteTaskList", this);
        e.stopPropagation();
      },
    });
    this.listenersActive = true;
  }

  removeMenuListeners() {
    if (!this.listenersActive) return;
    // publish a menuItemSelected event when the menuItem is clicked
    pubsub.publish("deleteEventListener", {
      element: this.menuItem.container,
      type: "click",
    });

    pubsub.publish("deleteEventListener", {
      element: this.menuItem.updateList,
      type: "click",
    });

    pubsub.publish("deleteEventListener", {
      element: this.menuItem.deleteList,
      type: "click",
    });
    this.listenersActive = false;
  }

  // subscribe to each of the task alteration events
  _subscribeToTaskEvents() {
    return [
      pubsub.subscribe("createTaskSubmitted", this.createTask.bind(this)),
      pubsub.subscribe("updateTaskSubmitted", this.updateTask.bind(this)),
      pubsub.subscribe("deleteTask", this.deleteTask.bind(this)),
    ];
  }

  // unsubscribe from each of the task alteration events
  _unsubscribeFromTaskEvents(subscriptions) {
    subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // get a task from the task list given an id
  _getTaskById(id) {
    return this.tasks.find((x) => x.id === id);
  }

  updateName(name) {
    this.name = name;
    this.menuItem.name.textContent = this.name;
  }

  get id() {
    return this._id;
  }

  set id(id) {
    this._id = id;
  }

  get name() {
    return this._name;
  }

  set name(name) {
    this._name = name;
  }

  get tasks() {
    return this._tasks;
  }

  set tasks(tasks) {
    this._tasks = tasks;
  }

  get increment() {
    return this._increment;
  }

  set increment(increment) {
    this._increment = increment;
  }

  get menuItem() {
    return this._menuItem;
  }

  set menuItem(menuItem) {
    this._menuItem = menuItem;
  }

  get subscriptions() {
    return this._subscriptions;
  }

  set subscriptions(subscriptions) {
    this._subscriptions = subscriptions;
  }
}

export default TaskList;
