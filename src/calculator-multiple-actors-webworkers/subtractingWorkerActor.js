addEventListener("message", function(e) {
  setTimeout(() => {postMessage(e.data.total - e.data.subtract)}, Math.floor((Math.random() * 5000) + 1));
}, false);