const taskManager = (() => {
  const _tasks = [];

  const getTaskIndexById = (task) => _tasks.findIndex((x) => x.id === task.id);

  const addTask = (task) => _tasks.push(task);

  const removeTask = (task) => _tasks.splice(getTaskIndexById(task), 1);

  const getTasks = () => _tasks;

  return { addTask, removeTask, getTasks };
})();

export default taskManager;
