import Task from './Task';
import pubsub from './pubsub';
import tagFactory from './tagFactory';

class TaskList {
  constructor(id, name, increment) {
    this.id = id;
    this.name = name;
    this.tasks = [];
    this.increment = increment || 0;
    this.menuItem = this.createMenuItem();
    this.listenersActive = false;
    this.addMenuListeners();
  }

  // add functionality to this TaskList object
  activate() {
    this.subscriptions = this.subscribeToTaskEvents();
    this.tasks.forEach((task) => task.addEventListeners());
  }

  // remove functionality from this TaskList object
  deactivate() {
    // if the task list has no subscriptions, it musn't have been activated
    // yet and therefore will have no event listeners
    if (!this.subscriptions) return;
    this.unsubscribeFromTaskEvents();
    this.tasks.forEach((task) => task.removeEventListeners());
  }

  // remove this task list
  remove() {
    this.deactivate();
    this.removeMenuListeners();
    this.name = '';
    this.tasks = [];
  }

  // add a new task to the task list and render the result
  createTask(info) {
    const task = new Task(
      Number(info.id) === info.id ? info.id : this.increment,
      info.title,
      info.datetime,
      info.priority,
      info.isComplete || false,
    );
    this.increment += 1;
    this.tasks.push(task);
    task.addEventListeners();
    pubsub.publish('taskListUpdated');
  }

  // update the task associated with the given taskId with the new taskInfo
  updateTask(info) {
    const task = this.getTaskById(Number(info.id));
    task.setTitle(info.title);
    task.setDueDate(info.datetime);
    task.setPriority(info.priority);
    // publish taskListUpdated so that we can update local storage
    pubsub.publish('taskListUpdated');
  }

  // render the task list by appending it to the provided container
  deleteTask(task) {
    task.removeEventListeners();
    this.tasks = this.tasks.filter((t) => t !== task);
    pubsub.publish('taskListUpdated');
  }

  createEditForm() {
    const container = tagFactory.createTag('form', {
      class: `update-list-form update-${this.id}`,
    });
    const input = tagFactory.createTag('input', {
      type: 'text',
      class: 'update-list-input',
      name: 'list-name',
      id: this.id,
    });
    const submit = tagFactory.createTag('button', {
      type: 'submit',
      class: 'update-list-submit',
    });
    submit.appendChild(
      tagFactory.createTag('i', { class: 'far fa-check-circle' }),
    );

    container.appendChild(input);
    container.appendChild(submit);

    return { container, input, submit };
  }

  // create a menu itemm containing a delete and edit button
  createMenuItem() {
    const container = tagFactory.createTag('li', { class: 'list-entry' });
    const name = tagFactory.createTag('p', {}, this.name);
    const controls = tagFactory.createTag('div', { class: 'controls' });
    const updateList = tagFactory.createTag('button');
    updateList.appendChild(tagFactory.createTag('i', { class: 'far fa-edit' }));
    const deleteList = tagFactory.createTag('button');
    deleteList.appendChild(
      tagFactory.createTag('i', { class: 'far fa-trash-alt' }),
    );
    const form = this.createEditForm();

    controls.appendChild(updateList);
    controls.appendChild(deleteList);
    container.appendChild(name);
    container.appendChild(controls);

    return { container, name, updateList, deleteList, form, controls };
  }

  updateMenuItem(type) {
    this.menuItem.container.innerHTML = '';
    if (type === 'form') {
      this.menuItem.container.appendChild(this.menuItem.form.container);
    } else {
      this.menuItem.container.appendChild(this.menuItem.name);
      this.menuItem.container.appendChild(this.menuItem.controls);
    }
  }

  addMenuListeners() {
    if (this.listenersActive) return;
    // publish a menuItemSelected event when the menuItem is clicked
    pubsub.publish('createEventListener', {
      element: this.menuItem.container,
      type: 'click',
      fn: () => pubsub.publish('menuItemSelected', this),
    });

    pubsub.publish('createEventListener', {
      element: this.menuItem.updateList,
      type: 'click',
      fn: (e) => {
        pubsub.publish('updateTaskList', this);
        e.stopPropagation();
      },
    });

    pubsub.publish('createEventListener', {
      element: this.menuItem.deleteList,
      type: 'click',
      fn: (e) => {
        pubsub.publish('deleteTaskList', this);
        e.stopPropagation();
      },
    });
    this.listenersActive = true;
  }

  removeMenuListeners() {
    if (!this.listenersActive) return;
    // publish a menuItemSelected event when the menuItem is clicked
    pubsub.publish('deleteEventListener', {
      element: this.menuItem.container,
      type: 'click',
    });

    pubsub.publish('deleteEventListener', {
      element: this.menuItem.updateList,
      type: 'click',
    });

    pubsub.publish('deleteEventListener', {
      element: this.menuItem.deleteList,
      type: 'click',
    });
    this.listenersActive = false;
  }

  // subscribe to each of the task alteration events
  subscribeToTaskEvents() {
    return [
      pubsub.subscribe('createTaskSubmitted', this.createTask.bind(this)),
      pubsub.subscribe('updateTaskSubmitted', this.updateTask.bind(this)),
      pubsub.subscribe('deleteTask', this.deleteTask.bind(this)),
    ];
  }

  // unsubscribe from each of the task alteration events
  unsubscribeFromTaskEvents() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // get a task from the task list given an id
  getTaskById(id) {
    return this.tasks.find((x) => x.id === id);
  }

  updateName(name) {
    this.name = name;
    this.menuItem.name.textContent = this.name;
  }
}

export default TaskList;
