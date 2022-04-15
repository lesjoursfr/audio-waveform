const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("sendToElectron", function (channel, payload) {
  ipcRenderer.send(channel, payload);
});
