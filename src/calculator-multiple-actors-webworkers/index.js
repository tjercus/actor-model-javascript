const addingWorkerActor = new Worker("addingWorkerActor.js");
const subtractingWorkerActor = new Worker("subtractingWorkerActor.js");

let total = 0;

addingWorkerActor.addEventListener("message", evt => {
  console.log("Worker sent add response:", evt.data);
  total = evt.data;
  console.log("Calculator.total:", total);
}, false);

subtractingWorkerActor.addEventListener("message", evt => {
  console.log("Worker sent subtract response:", evt.data);
  total = evt.data;
  console.log("Calculator.total:", total);
}, false);

addingWorkerActor.postMessage({total: total, add: 6});
subtractingWorkerActor.postMessage({total: total, subtract: 5});