import EventEmitter from "eventemitter4";

const eventbus = new EventEmitter();

const Actor = {
  _eventbus: {},

  start(behavior, eventbus) {
    this._eventbus = eventbus;
    const address = Symbol();
    let state = typeof behavior.init === "function" ? behavior.init() : {};

    this._eventbus.on(address, ([method, message]) => {
      console.log("on", JSON.stringify(message));
      state = behavior[method](state, message) || state;
      this._eventbus.emit(method + "_evt", state);
    });

    return address;
  },

  send(target, message) {
    console.log("send", JSON.stringify(message));
    this._eventbus.emit(target, message);
  }
};

const calculatorBehaviour = {
	"init": () => {
		console.log("calculatorBehaviour.init()");
		return 0;
	},
	"add": (state, addable) => {
		const newState = state + addable;
		console.log("calculatorBehaviour.add", newState);
		return newState;
	},
  "subtract": (state, subtractable) => {
    const newState = state - subtractable;
    console.log("calculatorBehaviour.subtract", newState);
    return newState;
  }
};

eventbus.on("add_evt", (state) => {
	console.log("add_evt caught", state);
});

const calculatorActorAddress = Actor.start(calculatorBehaviour, eventbus);
Actor.send(calculatorActorAddress, ["add", 5]);
Actor.send(calculatorActorAddress, ["subtract", 4]);
Actor.send(calculatorActorAddress, ["add", 8]);
