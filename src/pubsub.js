const pubsub = (() => {
  const events = {};

  // subscribe to an event using the provided callback function
  const subscribe = (name, callback) => {
    if (!events[name]) events[name] = [];
    events[name].push(callback);

    // return the unsubscribe function for this event subscription
    return {
      unsubscribe: () => {
        if (!events[name]) return;
        events[name] = events[name].filter((f) => f !== callback);
      },
    };
  };

  // publish an event using the provided data
  const publish = (name, data) => {
    if (!Array.isArray(events[name])) return;
    events[name].forEach((callback) => callback(data));
  };

  return { subscribe, publish };
})();

export default pubsub;
