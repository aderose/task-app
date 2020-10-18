import pubsub from "./pubsub";

const formHandler = (doc) => {
  const formContainer = doc.querySelector(".form-container");
  const form = formContainer.childNodes[1];
  const formHeader = form.childNodes[1];
  const add = doc.querySelector(".add");
  const submit = form.childNodes[15].childNodes[1];
  const cancel = doc.querySelector("#cancel");

  pubsub.publish("createFormListener", form);
  pubsub.publish("createAddListener", add);
  pubsub.publish("createCancelListener", cancel);

  pubsub.subscribe("editForm", editForm);
  pubsub.subscribe("submitForm", submitForm);
  pubsub.subscribe("addForm", () => showForm("add"));
  pubsub.subscribe("cancelForm", hideForm);

  function submitForm({ submitType }) {
    console.log(submitType);
    gatherInput(form);
    hideForm();
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
    showForm("edit");
  }

  function hideForm() {
    formContainer.classList.remove("visible");
  }

  function showForm(formType) {
    // update form header and submit button to match the form content
    if (formType === "add") {
      formHeader.textContent = "Add Task";
      submit.value = "Add";
    } else if (formType === "edit") {
      formHeader.textContent = "Edit Task";
      submit.value = "Edit";
    }

    // show the form of provided formType
    formContainer.classList.add("visible");
  }
};

export default formHandler;
