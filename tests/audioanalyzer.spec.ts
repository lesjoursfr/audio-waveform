import test from 'ava';
import { resolve } from 'path';
import { AudioAnalyzer } from '../src/index';

async function runTestOn (input: string) : Promise<boolean> {
  const file = resolve(__dirname, input);

  const audioAnalyzer = new AudioAnalyzer(file);
  const op = await audioAnalyzer.waveform();
  return op.duration > 0 && op.waveform.length > 0;
}

test.serial('AudioAnalyzer > waveform', async (t) => {
  t.is(await runTestOn('audio.m4a'), true);
});
