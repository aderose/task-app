import pubsub from "./pubsub";

// handle all document event listeners
const inputHandler = (doc) => {
  pubsub.subscribe("createEditListener", editListener);
  pubsub.subscribe("createDeleteListener", trashListener);
  pubsub.subscribe("createFormListener", formListener);
  pubsub.subscribe("createAddListener", addListener);
  pubsub.subscribe("createCancelListener", cancelListener);

  function addListener(add) {
    add.addEventListener("click", () => pubsub.publish("addForm"));
  }

  function cancelListener(cancel) {
    cancel.addEventListener("click", () => pubsub.publish("cancelForm"));
  }

  function formListener(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      pubsub.publish("submitForm", {
        submitType: e.target.childNodes[15].childNodes[1].value,
      });
    });
  }

  function trashListener({ task, trash }) {
    trash.addEventListener("click", (e) => {
      pubsub.publish("removeTask", task);
    });
  }

  function editListener({ task, edit }) {
    edit.addEventListener("click", (e) => {
      pubsub.publish("editForm", task);
    });
  }
};

export default inputHandler;
