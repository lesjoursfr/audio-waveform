import { exec } from 'child_process';
import { resolve } from 'path';
import { promisify } from 'util';

const execp = promisify(exec);
const script = resolve(__dirname, './audio-analyzer/runner.js');

interface AudioAnalyzerError {
  error: string;
}

interface AudioAnalyzerWaveform {
  duration: number;
  waveform: Array<number>;
}

function cleanOutput (std: string) : AudioAnalyzerError | AudioAnalyzerWaveform | null {
  // We look for a line that contains a valid JSON string
  let result = null;
  for (const line of std.split('\n')) {
    try {
      result = JSON.parse(line);
    } catch (err) { /* Nothing to do */ }
  }
  return result;
};

// AudioAnalyzer Module
export class AudioAnalyzer {
  file: string;

  constructor (file: string) {
    this.file = file;
  }

  async waveform () : Promise<AudioAnalyzerWaveform> {
    // Render the PDF
    const command = `node ${require.resolve('electron/cli.js')} --no-sandbox ${script} --file ${this.file}`;
    const { stdout } = await execp(command);

    // Clean output
    const opResult = cleanOutput(stdout);
    if (opResult === null) {
      throw new Error(`Wrong operation result [command : ${command}]`);
    } else if ('error' in opResult) {
      throw new Error(opResult.error);
    }

    // Return the AudioAnalyzerWaveform
    return opResult;
  }
}
