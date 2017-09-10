// index.js


import EventEmitter from "eventemitter4";

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

export default Actor;

/* ---------------- runtime ----------------- */

const addingBehaviour = {
	"init": () => {
		console.log("addingBehaviour.init()");
		return 0;
	},
	"add": (state, addable) => {
		const newState = state + addable;
		console.log("addingBehaviour.add", newState);
		return newState;
	}	
};

eventbus.on("add_evt", (state) => {
	console.log("add_evt caught", state);
});

const addingActorAddress = Actor.start(addingBehaviour);
Actor.send(addingActorAddress, ["add", 5]);
Actor.send(addingActorAddress, ["add", 8]);



// const address = Actor.start(eventbus);

console.log(addingActorAddress); //=> Symbol()