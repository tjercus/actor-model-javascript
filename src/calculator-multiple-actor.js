import EventEmitter from "eventemitter4";

const eventbus = new EventEmitter();

const calculatorActor = {
  _address: Symbol(),
  _eventbus: {},
	_addingActorAddress: "",
  _subtractingActorAddress: "",
  _state: 0,

  start(eventbus, addresses) {
    this._eventbus = eventbus;
    this._addingActorAddress = addresses[0];
    this._asubtractingActorAddress = addresses[1];
    this._eventbus.on(this._address, ([method, nr]) => {
      if ("add" === method) {
        this._eventbus.emit(this._addingActorAddress, [this._address, this._state, nr]);
      }
      if ("subtract" === method) {
        this._eventbus.emit(this._subtractingActorAddress, [this._address, this._state, nr]);
      }
      if ("add_response" === method) {
        this.state = nr;
        console.log("add_response", nr);
      }
      if ("subtract_response" === method) {
        this.state = nr;
        console.log("subtract_response", nr);
      }
    });

    return this._address;
  }
};

const addingActor = {
  _address: Symbol(),
  start(eventbus) {
    this._eventbus = eventbus;
    this._eventbus.on(this._address, ([senderAddress, base, addable]) => {
      this._eventbus.emit(senderAddress, ["add_response", base + addable]);
    });
    return this._address;
  }
};

const subtractingActor = {
  _address: Symbol(),
  start(eventbus) {
    this._eventbus = eventbus;
    this._eventbus.on(this._address, ([senderAddress, base, addable]) => {
      this._eventbus.emit(senderAddress, ["subtract_response", this._state - addable]);
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
const calculatorActorAddress = calculatorActor.start(eventbus, {addingActorAddress, subtractingActorAddress});

actorSystemInstance.send(calculatorActorAddress, ["add", 5]);
actorSystemInstance.send(calculatorActorAddress, ["subtract", 4]);
