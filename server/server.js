const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ port: 8080 });

// Maps channel names to an array of websocket connections
const subscriptions = {};

function websocketSubscribe(ws, channelName) {
	if (subscriptions[channelName] === undefined) {
		subscriptions[channelName] = [ws];
	} else {
		subscriptions[channelName].push(ws);
	}
}

function sendMessageToChannels(channelName, message) {
	const sockets = subscriptions[channelName];
	if (!sockets) {
		return;
	}

	for (const socket of sockets) {
		socket.send(JSON.stringify({
			channel: channelName,
			message
		}));
	}
}


wss.on("connection", function connection(ws) {
	console.log("Someone connected");
	ws.on("message", function incoming(message) {
		console.log("received: %s", message);
		const data = JSON.parse(message);
		if (data.type == "subscribe") {
			websocketSubscribe(ws, data.channel);
		} else if (data.type == "message") {
			sendMessageToChannels(data.channel, data.message);
		}
	});
});



