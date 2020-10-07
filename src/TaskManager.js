class TaskManager {
  constuctor() {
    this.tasks = [];
  }

  addTask(task) {
    if (!this.tasks) this.tasks = [];
    this.tasks.push(task);
  }

  removeTask(task) {
    const taskId = this.tasks.findIndex((x) => x.id === task.id);
    this.tasks.splice(taskId, 1);
  }

  set tasks(tasks) {
    this._tasks = tasks;
  }

  get tasks() {
    return this._tasks;
  }
}

export default TaskManager;
