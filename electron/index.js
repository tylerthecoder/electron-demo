const { app, BrowserWindow, Notification, ipcMain } = require('electron')
const path = require('path')

function createWindow() {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			devTools: true,
			preload: path.join(__dirname, 'preload.js')
		}
	})

	win.loadURL('http://localhost:5000');
	win.webContents.openDevTools()

	ipcMain.handle('chat', (event, channel, message) => {
		console.log("Chat message", channel, message);

		const notification = new Notification({
			title: channel,
			body: message
		});

		notification.on('click', (event, arg) => {
			console.log("clicked")
			win.show();
			win.webContents.send('notification-clicked', channel, message)
		})

		notification.show();
	})
}

app.whenReady().then(createWindow)

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
});