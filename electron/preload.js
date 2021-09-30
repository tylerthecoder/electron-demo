const { contextBridge, ipcRenderer } = require("electron")

console.log("Running preload");

contextBridge.exposeInMainWorld("chat", {
	sendMessage: (message, channel) => ipcRenderer.invoke("chat", message, channel),
	onNotificationClicked: (callback) => {
		ipcRenderer.on("notification-clicked", (event, arg) => {
			callback(arg);
		});
	}
})
