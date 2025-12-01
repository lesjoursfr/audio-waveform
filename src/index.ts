import { exec } from "child_process";
import { resolve } from "path";
import { promisify } from "util";

const execp = promisify(exec);
const script = resolve(__dirname, "./audio-analyzer/runner.js");

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

function cleanOutput(std: string): AudioAnalyzerError | AudioAnalyzerWaveform | null {
  // We look for a line that contains a valid JSON string
  let result = null;
  for (const line of std.split("\n")) {
    try {
      result = JSON.parse(line);
    } catch (_err) {
      /* Nothing to do */
    }
  }
  return result;
}

function isExecpError(err: unknown): err is Error & { stdout: string; stderr: string } {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return err instanceof Error && typeof (err as any).stdout === "string" && typeof (err as any).stderr === "string";
}

async function exitCodeSafeExec(command: string): Promise<string> {
  // Execute the comand
  let result: { stdout: string; stderr: string };
  try {
    result = await execp(command);
  } catch (execpErr) {
    // Restore the result if there is an error
    if (isExecpError(execpErr)) {
      result = { stdout: execpErr.stdout, stderr: execpErr.stderr };
    } else {
      result = { stdout: "", stderr: execpErr instanceof Error ? execpErr.message : "Missing error message" };
    }
  }
  if (result.stdout !== "") {
    return result.stdout;
  }
  throw new Error(`Operation failed [command : ${command}]\n${result.stderr}`);
}

// AudioAnalyzer Module
export class AudioAnalyzer {
  file: string;
  options: AudioAnalyzerOptions;

  constructor(file: string, options?: AudioAnalyzerOptions) {
    this.file = file;
    this.options = options || { xvfb: false, xvfbArgs: undefined };
  }

  private command(): string {
    if (this.options.xvfb) {
      return `xvfb-run ${this.options.xvfbArgs || ""} node ${require.resolve("electron/cli.js")} --no-sandbox ${script} --file ${this.file}`;
    }

    return `node ${require.resolve("electron/cli.js")} --no-sandbox ${script} --file ${this.file}`;
  }

  async waveform(): Promise<AudioAnalyzerWaveform> {
    // Render the Waveform
    const command = this.command();
    const stdout = await exitCodeSafeExec(command);

    // Clean output
    const opResult = cleanOutput(stdout);
    if (opResult === null) {
      throw new Error(`Wrong operation result [command : ${command}]`);
    } else if ("error" in opResult) {
      throw new Error(opResult.error);
    }

    // Return the AudioAnalyzerWaveform
    return opResult;
  }
}
