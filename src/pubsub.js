const pubsub = (() => {
  const events = {};

  const subscribe = (name, callback) => {
    if (!events[name]) events[name] = [];
    events[name].push(callback);
  };

  const unsubscribe = (name, callback) => {
    if (!events[name]) return;
    events[name] = events[name].filter((f) => f !== callback);
  };

  const publish = (name, data) => {
    if (!Array.isArray(events[name])) return;
    events[name].forEach((callback) => callback(data));
  };

  return { subscribe, unsubscribe, publish };
})();

export default pubsub;
