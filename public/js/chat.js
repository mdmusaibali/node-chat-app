const socket = io();

socket.on("countUpdated", (countFromServer) => {
  console.log("The count has been updated", countFromServer);
});

document.querySelector("#increment").addEventListener("click", () => {
  socket.emit("increment");
});
