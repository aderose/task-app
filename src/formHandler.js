import pubsub from "./pubsub";
import tagFactory from "./tagFactory";
import Form from "./Form";

const formHandler = () => {
  // create a form object for the add task form & listen for events
  const createTaskForm = new Form(
    "createTask",
    ".form-container",
    ".add-task-form",
    ".close-add-form",
    ".form-header"
  );

  // create a form object for the edit task form & listen for events
  const updateTaskForm = new Form(
    "updateTask",
    ".form-container",
    ".add-task-form",
    ".close-add-form",
    ".form-header"
  );

  pubsub.subscribe("createTaskFormOpen", () =>
    createTaskForm.show({
      defaults: {
        submit: "Add",
      },
    })
  );

  pubsub.subscribe("updateTaskFormOpen", (task) =>
    updateTaskForm.show({
      id: task.id,
      defaults: {
        title: task.title,
        datetime: task.dueDate,
        priority: task.priority,
        submit: "Edit",
      },
    })
  );
};

export default formHandler;
