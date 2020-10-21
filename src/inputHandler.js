import pubsub from "./pubsub";

// handle all document event listeners
const inputHandler = () => {
  // subscribe to all create Listener events to listen for user input
  pubsub.subscribe("createEditListener", editListener);
  pubsub.subscribe("createDeleteListener", trashListener);
  pubsub.subscribe("createFormListener", formListener);
  pubsub.subscribe("createAddListener", addListener);
  pubsub.subscribe("createCancelListener", cancelListener);
  pubsub.subscribe("createCompleteListener", completeListener);

  // publish an "addForm" event when the add task button is clicked
  function addListener(add) {
    add.addEventListener("click", () => pubsub.publish("addForm"));
  }

  // publish an "cancelForm" event when the form cancel button is clicked
  function cancelListener(cancel) {
    cancel.addEventListener("click", () => pubsub.publish("cancelForm"));
  }

  // publish "submitForm" event when form is submitted
  function formListener(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      pubsub.publish("submitForm");
    });
  }

  // publish "removeTask" event when a task's remove button is clicked
  function trashListener({ task, trash }) {
    trash.addEventListener("click", (e) => {
      pubsub.publish("removeTask", task);

      // prevent underlying div listener from being activated
      e.stopPropagation();
    });
  }

  // publish "editForm" event when a task's edit button is clicked
  function editListener({ task, edit }) {
    edit.addEventListener("click", (e) => {
      pubsub.publish("editForm", task);
      // prevent underlying div listener from being activated
      e.stopPropagation();
    });
  }

  // publish "taskComplete" event when a task container is clicked
  function completeListener({ element, textTag, task }) {
    element.addEventListener("click", () => {
      pubsub.publish("completeTask", { textTag, task });
    });
  }
};

export default inputHandler;
