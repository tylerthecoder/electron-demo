if (window.chat) {
	window.chat.onNotificationClicked((channel) => {
		showChannel(channel);
	})
}

var socket = new WebSocket("ws://localhost:8080");
socket.onopen = function (event) {
	console.log("Connected to server");
};

socket.onmessage = function (event) {
	console.log("Got Message", event.data);

	const data = JSON.parse(event.data);

	channels[data.channel].push(data.message);

	if (window.chat) {
		window.chat.sendMessage(data.channel, data.message);
	}

	if (data.channel === selectedChannel) {
		showChannel(selectedChannel);
	}
}

const channels = {};

let selectedChannel;

function sendMessage() {
	const message = document.getElementById("messageInput").value;
	document.getElementById("messageInput").value = "";
	console.log("Sending Message", message);
	const payload = {
		type: "message",
		channel: selectedChannel,
		message,
	};
	const json = JSON.stringify(payload);
	socket.send(json);
}

function joinChannel() {
	const channel = document.getElementById("channelInput").value;
	document.getElementById("channelInput").value = "";
	console.log("Joining Channel", channel);

	selectedChannel = channel;

	const payload = {
		type: "subscribe",
		channel
	};
	const json = JSON.stringify(payload);
	socket.send(json);
	channels[channel] = [];
	showChannelButtons();
	showChannel(channel);
}

function showChannel(channel) {
	selectedChannel = channel;
	document.getElementById("main").style.visibility = "visible";
	const messages = channels[channel];
	const html = messages.map(message => `<div class='chat'><p>${message}</p></div>`).join("");
	document.getElementById("messages").innerHTML = html;
	showChannelButtons();
}

function showChannelButtons() {
	const channelNames = Object.keys(channels);
	const html = channelNames.map(channel => `<div class='channelButton ${channel === selectedChannel && "selectedChannel"}' onclick="showChannel('${channel}')"><p>${channel}</p></div>`).join("");
	document.getElementById("channelButtons").innerHTML = html;
}