import test from 'ava';
import { resolve } from 'path';
import { AudioAnalyzer, AudioAnalyzerOptions } from '../src/index';

async function runTestOn (input: string, options?: AudioAnalyzerOptions) : Promise<boolean> {
  const file = resolve(__dirname, input);

  const audioAnalyzer = new AudioAnalyzer(file, options);
  const op = await audioAnalyzer.waveform();
  return op.duration > 0 && op.waveform.length > 0;
}

test.serial('AudioAnalyzer > waveform', async (t) => {
  t.is(await runTestOn('audio.m4a'), true);
});

test.serial('AudioAnalyzer > waveform (xvfb-run)', async (t) => {
  const options = {
    xvfb: true,
    xvfbArgs: '--server-args="-screen 0 1024x768x24" --auto-servernum --error-file="/tmp/xvfb-error.txt"'
  };

  t.is(await runTestOn('audio.m4a', options), true);
});
