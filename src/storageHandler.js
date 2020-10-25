import pubsub from "./pubsub";

function storageHandler() {
  let storage = undefined;

  pubsub.subscribe("updateStorage", updateStorage);
  pubsub.subscribe("getStorage", getStorage);

  // update the localstorage data
  function updateStorage(data) {
    localStorage.setItem("data", JSON.stringify(data));
  }

  // get data from local storage and store it
  function pullStorage() {
    storage = JSON.parse(localStorage.getItem("data"));
  }

  // publish a storage retrieved event with the retrieved storage
  function getStorage() {
    pubsub.publish("storageRetrieved", storage);
  }

  return { pullStorage };
}

export default storageHandler;
