const pubsub = (() => {
  const events = {};

  // subscribe to an event using the provided callback function
  const subscribe = (name, callback) => {
    if (!events[name]) events[name] = [];
    events[name].push(callback);
  };

  // unsubscribe from an event with the provided callback function
  const unsubscribe = (name, callback) => {
    if (!events[name]) return;
    events[name] = events[name].filter((f) => f !== callback);
  };

  // publish an event using the provided data
  const publish = (name, data) => {
    if (!Array.isArray(events[name])) return;
    events[name].forEach((callback) => callback(data));
  };

  return { subscribe, unsubscribe, publish };
})();

export default pubsub;
