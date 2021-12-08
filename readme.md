[![npm version](https://badge.fury.io/js/@lesjoursfr%2Faudio-waveform.svg)](https://badge.fury.io/js/@lesjoursfr%2Faudio-waveform)
[![Build Status](https://travis-ci.org/lesjoursfr/audio-waveform.svg?branch=master)](https://travis-ci.org/lesjoursfr/audio-waveform)

audio-waveform
================
Generate PDF from HTML with simple API in Node.js.

# What is this library?

This library use electron to generate PDF files from HTML.



## Usage

Install the lib and add it as a dependency :

```
    npm install @lesjoursfr/audio-waveform
```

Then put this in your code:

```javascript
    const { PDF } = require("@lesjoursfr/audio-waveform");

    const pdf = new PDF(target, output);
    pdf.render()
        .then(() => {
            console.log("PDF Generated Successfully!")
        })
        .catch((err) => {
            console.error("Failed to generate PDF because of ", err)
        });
    );
```

#### Parameters

- `target`:
    The URL of the HTML page
- `output`:
    The PDF file path
