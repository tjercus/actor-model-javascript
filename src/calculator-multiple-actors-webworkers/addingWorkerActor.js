addEventListener("message", function(e) {
  setTimeout(() => {postMessage(e.data.total + e.data.add)}, Math.floor((Math.random() * 5000) + 1));
}, false);