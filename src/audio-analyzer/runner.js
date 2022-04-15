const { join, extname } = require("path");
const { app, BrowserWindow } = require("electron");
const { readFileSync, writeFileSync, unlinkSync } = require("fs");
const { string: yargs } = require("yargs");
const { v4: uuidv4 } = require("uuid");
const { lookup } = require("mime-types");

// Function to generate the HTML file
function generateHtmlFile(audioFile) {
  return readFileSync(join(__dirname, "runner.html"), { encoding: "utf8" })
    .replace("%FILE_MIME_TYPE%", lookup(extname(audioFile)))
    .replace("%FILE_RESSOURCE_PATH%", `file://${audioFile}`);
}

// Arguments
const { file } = yargs(["file"]).argv;

// Wait until Electron is Ready
app.on("ready", function () {
  // Variables
  const filename = uuidv4();
  const htmlFile = "/tmp/" + filename + ".html";

  // Create a temporary file
  writeFileSync(htmlFile, generateHtmlFile(file), { encoding: "utf8" });

  // Load the HTML File into Electron
  const window = new BrowserWindow({
    show: false,
    width: 1024,
    height: 768,
    webPreferences: {
      sandbox: false,
      preload: join(__dirname, "preload.js"),
    },
  });
  window.loadURL(`file://${htmlFile}`);
  window.webContents.on("ipc-message", function (event, channel, payload) {
    // Check the channel
    switch (channel) {
      case "error":
        process.stdout.write(`${JSON.stringify({ error: payload })}\n`, "utf8");
        break;
      case "result":
        process.stdout.write(`${JSON.stringify(payload)}\n`, "utf8");
        break;
    }

    // Remove the Temporary File
    unlinkSync(htmlFile);

    // Shutdown Electron
    window.close();
    app.quit();
  });
});
