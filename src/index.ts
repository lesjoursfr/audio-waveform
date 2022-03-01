import { exec } from 'child_process';
import { resolve } from 'path';
import { promisify } from 'util';

const execp = promisify(exec);
const script = resolve(__dirname, './audio-analyzer/runner.js');

export interface AudioAnalyzerOptions {
  xvfb: boolean;
  xvfbArgs: string | undefined;
}

interface AudioAnalyzerError {
  error: string;
}

interface AudioAnalyzerWaveform {
  duration: number;
  waveform: Array<number>;
}

function cleanOutput (std: string): AudioAnalyzerError | AudioAnalyzerWaveform | null {
  // We look for a line that contains a valid JSON string
  let result = null;
  for (const line of std.split('\n')) {
    try {
      result = JSON.parse(line);
    } catch (err) { /* Nothing to do */ }
  }
  return result;
}

// AudioAnalyzer Module
export class AudioAnalyzer {
  file: string;
  options: AudioAnalyzerOptions;

  constructor (file: string, options?: AudioAnalyzerOptions) {
    this.file = file;
    this.options = options || { xvfb: false, xvfbArgs: undefined };
  }

  private command (): string {
    if (this.options.xvfb) {
      return `xvfb-run ${this.options.xvfbArgs || ''} node ${require.resolve('electron/cli.js')} --no-sandbox ${script} --file ${this.file}`;
    }

    return `node ${require.resolve('electron/cli.js')} --no-sandbox ${script} --file ${this.file}`;
  }

  async waveform (): Promise<AudioAnalyzerWaveform> {
    // Render the Waveform
    const command = this.command();
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
