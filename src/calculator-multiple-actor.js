import EventEmitter from "eventemitter4";

const eventbus = new EventEmitter();

/* Is a worker that:
 - receives add- or subtract request
 - and asks workers to do work
 - holds the state for the calculator
 */
const calculatorActor = {
  _address: Symbol(),
  _eventbus: {},
	_addingActorAddress: "",
  _subtractingActorAddress: "",
  _state: 0,

  start(eventbus, addresses) {
    this._eventbus = eventbus;
    this._addingActorAddress = addresses.addingActorAddress;
    this._subtractingActorAddress = addresses.subtractingActorAddress;
    this._eventbus.on(this._address, ([method, nr]) => {
      console.log("calculatorActor received", method, nr);
      if ("add" === method) {
        console.log("calculatorActor (add) emitting to", this._addingActorAddress);
        this._eventbus.emit(this._addingActorAddress, [this._address, this._state, nr]);
      }
      if ("subtract" === method) {
        console.log("calculatorActor (subtract) emitting to", this._subtractingActorAddress);
        this._eventbus.emit(this._subtractingActorAddress, [this._address, this._state, nr]);
      }
      if ("add_response" === method) {
        this._state = nr;
        console.log("add_response", this._state );
      }
      if ("subtract_response" === method) {
        this._state = nr;
        console.log("subtract_response", this._state);
      }
    });

    return this._address;
  }
};

/* Is a worker that knows how to add two numbers and sends a message to the requester when done */
const addingActor = {
  _address: Symbol(),
  start(eventbus) {
    this._eventbus = eventbus;
    this._eventbus.on(this._address, ([senderAddress, base, addable]) => {
      console.log("addingActor received", base, addable);
      this._eventbus.emit(senderAddress, ["add_response", base + addable]);
    });
    return this._address;
  }
};

/* Is a worker that knows how to subtract two numbers and sends a message to the requester when done */
const subtractingActor = {
  _address: Symbol(),
  start(eventbus) {
    this._eventbus = eventbus;
    this._eventbus.on(this._address, ([senderAddress, base, subtractable]) => {
      console.log("subtractingActor received", base, subtractable);
      this._eventbus.emit(senderAddress, ["subtract_response", base - subtractable]);
    });
    return this._address;
  }
};

const actorSystem = {
  _eventbus: {},
  start(eventbus) {
    this._eventbus = eventbus;
    return this;
  },
  send(address, method, message) {
    this._eventbus.emit(address, [method, message]);
  }
};

const actorSystemInstance = actorSystem.start(eventbus);
const addingActorAddress = addingActor.start(eventbus);
const subtractingActorAddress = subtractingActor.start(eventbus);
const routingConfiguration = {
  addingActorAddress: addingActorAddress,
  subtractingActorAddress: subtractingActorAddress
};
const calculatorActorAddress = calculatorActor.start(eventbus, routingConfiguration);

actorSystemInstance.send(calculatorActorAddress, "add", 5);
actorSystemInstance.send(calculatorActorAddress, "add", 66);
actorSystemInstance.send(calculatorActorAddress, "subtract", 4);
