import pubsub from "./pubsub";

// handle form input provided by the user
const inputHandler = (doc) => {
  const formContainer = doc.querySelector(".form-container");
  const form = doc.querySelector("form");
  const add = doc.querySelector(".add");
  const cancel = doc.querySelector("#cancel");

  [add, cancel].forEach((btn) => btn.addEventListener("click", toggleForm));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    gatherInput(form);
    toggleForm();
    form.reset();
  });

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
