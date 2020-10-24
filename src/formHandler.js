import pubsub from "./pubsub";
import Form from "./Form";

const formHandler = () => {
  // create a form object for the add task form & listen for events
  const createTaskForm = new Form({
    type: "createTask",
    containerName: ".form-container",
    formName: ".add-task-form",
    cancelName: ".close-add-form",
    headerName: ".form-header",
  });

  // create a form object for the edit task form & listen for events
  const updateTaskForm = new Form({
    type: "updateTask",
    containerName: ".form-container",
    formName: ".add-task-form",
    cancelName: ".close-add-form",
    headerName: ".form-header",
  });

  const createListForm = new Form({
    type: "createList",
    containerName: ".list-selection-container",
    formName: ".add-list-form",
    cancelName: ".close-select-list",
  });

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

  // show the task list menu (containing create list form)
  pubsub.subscribe("createListFormOpen", () => {
    createListForm.show({
      defaults: {
        "add-list": "Add",
      },
    });
  });

  // hide the task list menu (containing the create list form)
  pubsub.subscribe("createListFormHide", () => createListForm.hide());
};

export default formHandler;
