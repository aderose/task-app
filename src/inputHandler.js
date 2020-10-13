import pubsub from "./pubsub";

// handle form input provided by the user
const inputHandler = (doc) => {
  doc.querySelector(".add").addEventListener("click", () => {
    doc.querySelector(".form-container").classList.toggle("visible");
  });

  const form = doc.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    gatherInput(form);
    doc.querySelector(".form-container").classList.toggle("visible");
  });

  function gatherInput(form) {
    const formData = new FormData(form);
    pubsub.publish("addTask", {
      title: formData.get("title"),
      date: formData.get("date"),
      priority: formData.get("priority"),
    });
  }
};

export default inputHandler;
