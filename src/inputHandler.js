import pubsub from "./pubsub";

// handle form input provided by the user
const inputHandler = (doc) => {
  const formContainer = doc.querySelector(".form-container");
  const form = doc.querySelector("form");
  const add = doc.querySelector(".add");
  const cancel = doc.querySelector("#cancel");

  pubsub.subscribe("createEditListener", editListener);
  pubsub.subscribe("createDeleteListener", trashListener);

  [add, cancel].forEach((btn) => btn.addEventListener("click", toggleForm));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    gatherInput(form);
    toggleForm();
    form.reset();
  });

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

  function editTask(task) {
    form["title"].value = task.title;
    form["datetime-local"].value = task.dueDate;
    form["priority"].value = task.priority;
    toggleForm();
  }

  function gatherInput(form) {
    const formData = new FormData(form);
    pubsub.publish("addTask", {
      title: formData.get("title"),
      datetime: formData.get("datetime-local"),
      priority: formData.get("priority"),
    });
  }

  function toggleForm() {
    formContainer.classList.toggle("visible");
  }
};

export default inputHandler;
