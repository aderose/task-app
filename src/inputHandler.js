import pubsub from "./pubsub";

// handle form input provided by the user
const inputHandler = (doc) => {
  doc.querySelector(".add").addEventListener("click", toggleForm);

  const form = doc.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    gatherInput(form);
    toggleForm();
  });

  doc.querySelector("#cancel").addEventListener("click", toggleForm);

  function gatherInput(form) {
    const formData = new FormData(form);
    pubsub.publish("addTask", {
      title: formData.get("title"),
      date: formData.get("datetime-local"),
      priority: formData.get("priority"),
    });
  }

  function toggleForm() {
    doc.querySelector(".form-container").classList.toggle("visible");
  }
};

export default inputHandler;
