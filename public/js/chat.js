const socket = io();

//ELEMENTS
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");
const $sidebar = document.querySelector(".chat__sidebar");
//TEMPLATES
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

//Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

socket.on("message", ({ text: message, createdAt, username }) => {
  const html = Mustache.render(messageTemplate, {
    message,
    createdAt: moment(createdAt).format("h:mm a"),
    username,
  });
  $messages.insertAdjacentHTML("beforeend", html);
  $messages.scroll({ top: $messages.scrollHeight, behavior: "smooth" });
});

socket.on("locationMessage", ({ url: location, createdAt, username }) => {
  const html = Mustache.render(locationTemplate, {
    location,
    createdAt: moment(createdAt).format("h:mm a"),
    username,
  });
  $messages.insertAdjacentHTML("beforeend", html);
  $messages.scroll({ top: $messages.scrollHeight, behavior: "smooth" });
});

socket.on("roomData", ({ room, users }) => {
  $sidebar.innerHTML = "";
  const html = Mustache.render(sidebarTemplate, { room, users });
  $sidebar.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = $messageFormInput.value;
  if (!message || message === "") return;
  //disable form
  $messageFormButton.setAttribute("disabled", "disabled");
  socket.emit("sendMessage", message, (error) => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    if (error) {
      return console.log(error);
    }
    console.log("Message delivered");
  });
});

document.querySelector("#send-location").addEventListener("click", () => {
  $sendLocationButton.setAttribute("disabled", "disabled");
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by browser");
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("sendLocation", { latitude, longitude }, () => {
        $sendLocationButton.removeAttribute("disabled");
        console.log("Location shared!!");
      });
    },
    () => {
      alert("Allow location");
    },
    {
      enableHighAccuracy: true,
    }
  );
});
