import pubsub from "./pubsub";

const formHandler = (doc) => {
  const formContainer = doc.querySelector(".form-container");
  const formHeader = doc.querySelector("form h2");
  const form = doc.querySelector("form");
  const add = doc.querySelector(".add");
  const cancel = doc.querySelector("#cancel");

  pubsub.publish("createFormListener", form);
  pubsub.publish("createAddListener", add);
  pubsub.publish("createCancelListener", cancel);

  pubsub.subscribe("editForm", editForm);
  pubsub.subscribe("submitForm", submitForm);
  pubsub.subscribe("toggleForm", toggleForm);
  pubsub.subscribe("addForm", () => toggleForm("add"));
  pubsub.subscribe("cancelForm", () => toggleForm("hide"));

  function submitForm() {
    gatherInput(form);
    toggleForm("hide");
    form.reset();
  }

  function gatherInput(form) {
    const formData = new FormData(form);
    pubsub.publish("addTask", {
      title: formData.get("title"),
      datetime: formData.get("datetime-local"),
      priority: formData.get("priority"),
    });
  }

  function editForm(task) {
    form["title"].value = task.title;
    form["datetime-local"].value = task.dueDate;
    form["priority"].value = task.priority;
    toggleForm("edit");
  }

  function toggleForm(formType) {
    console.log(formType);
    formContainer.classList.toggle("visible");
  }
};

export default formHandler;
