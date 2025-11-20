[![npm version](https://badge.fury.io/js/@lesjoursfr%2Faudio-waveform.svg)](https://badge.fury.io/js/@lesjoursfr%2Faudio-waveform)
[![QC Checks](https://github.com/lesjoursfr/audio-waveform/actions/workflows/quality-control.yml/badge.svg)](https://github.com/lesjoursfr/audio-waveform/actions/workflows/quality-control.yml)

# @lesjoursfr/audio-waveform

Generate waveform from an audio file with a simple API in Node.js.

# What is this library?

This library use electron to generate waveform files from an audio file.

## Usage

Install the lib and add it as a dependency :

```
npm install @lesjoursfr/audio-waveform
```

Then put this in your code:

```javascript
const { AudioAnalyzer } = require("@lesjoursfr/audio-waveform");

const audioAnalyzer = new AudioAnalyzer(file, options);
audioAnalyzer
	.waveform()
	.then(() => {
		console.log("Waveform Generated Successfully!");
	})
	.catch((err) => {
		console.error("Failed to generate Waveform because of ", err);
	});
```

#### Parameters

- `file`:
  The audio file
- `options`:
  Optional options to use xvfb for the generation
