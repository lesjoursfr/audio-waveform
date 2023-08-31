import assert from "assert";
import { resolve } from "path";
import { AudioAnalyzer, AudioAnalyzerOptions } from "../src/index";

async function runTestOn(input: string, options?: AudioAnalyzerOptions): Promise<boolean> {
  const file = resolve(__dirname, input);

  const audioAnalyzer = new AudioAnalyzer(file, options);
  const op = await audioAnalyzer.waveform();
  return op.duration > 0 && op.waveform.length > 0;
}

it("AudioAnalyzer > waveform", async () => {
  assert.strictEqual(await runTestOn("audio.m4a"), true);
}).timeout(10000);

it("AudioAnalyzer > waveform (xvfb-run)", async () => {
  const options = {
    xvfb: true,
    xvfbArgs: '--server-args="-screen 0 1024x768x24" --auto-servernum --error-file="/tmp/xvfb-error.txt"',
  };

  assert.strictEqual(await runTestOn("audio.m4a", options), true);
}).timeout(10000);
