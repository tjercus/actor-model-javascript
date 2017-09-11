import EventEmitter from "eventemitter4";

/**
 * Mostly copied from @see https://monades.roperzh.com/get-to-know-the-actor-model/
 * @type {{start: (function(*)), send: (function(*=, *=))}}
 */

const eventbus = new EventEmitter();

const Actor = {
  start(behavior) {
    const address = Symbol();
    let state = typeof behavior.init === "function" ? behavior.init() : {};

    eventbus.on(address, ([method, message]) => {
      console.log("on", JSON.stringify(message));
      state = behavior[method](state, message) || state;
      eventbus.emit(method + "_evt", state);
    });

    return address;
  },

  send(target, message) {
    console.log("send", JSON.stringify(message));
    eventbus.emit(target, message);
  }
};
