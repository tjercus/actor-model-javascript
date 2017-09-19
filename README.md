# actor-model-javascript

Playing with models ... eh ... actor-models, in JavaScript

## WHAT?

Tinkering with the actor model (https://en.wikipedia.org/wiki/Actor_model)

Based on the interesting post at https://monades.roperzh.com/get-to-know-the-actor-model/

#### calculator-single-actor.js

simple calculator with one actor

#### calculator-multiple-actors.js

simple calculator involving the coordination between three actors, one with controller/router
behaviour and two with addingWorkerActor skills.

#### calculator-multiple-actors-webworkers/index.js

simple calculator where adding and subtracting are done in separate threads.

## HOWTO
git clone
npm install (or yarn)
npm run test
