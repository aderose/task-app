import pubsub from "./pubsub";

// handle all document event listeners
const inputHandler = () => {
  const listeners = [];

  // subscribe to the relevant events
  pubsub.subscribe("addListener", addListener);

  // create an event listener for given properties return the removal function
  function addListener({ element, type, fn }) {
    element.addEventListener(type, fn);
    listeners.push({ element, type, fn });

    return {
      remove: () => {
        element.removeEventListener(type, fn);
        listeners.filter((listener) => listener !== { element, type, fn });
      },
    };
  }
};

export default inputHandler;
