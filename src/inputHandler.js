import pubsub from './pubsub';

// handle all document event listeners
const inputHandler = () => {
  const activeListeners = [];

  // create an event listener for the provided properties
  function createEventListener({ element, type, fn }) {
    activeListeners.push({ element, type, fn });
    element.addEventListener(type, fn);
  }

  // remove an event listener with the provided properties
  function deleteEventListener({ element, type }) {
    // get index of listener in the active listeners list
    const index = activeListeners.findIndex((listener) => {
      return listener.element === element && listener.type === type;
    });

    // if no listener is found
    if (index === -1) console.log('deleteEventListener: no listener found!');

    // remove listener from active listeners
    const listener = activeListeners.splice(index, 1)[0];

    // remove event listener from the element.
    listener.element.removeEventListener(listener.type, listener.fn);
  }

  // subscribe to the relevant events
  pubsub.subscribe('createEventListener', createEventListener);
  pubsub.subscribe('deleteEventListener', deleteEventListener);
};

export default inputHandler;
