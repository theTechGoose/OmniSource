import { debounce } from "@libs/std";

const project = "ai-activations";

const pathsToWatch = ["../../../"]; // Directories to watch for changes
const registryPattern = /registry.ts/;
const gitPattern = /git/;
const filter = [registryPattern, gitPattern]

const debounceMs = 300; // Debounce interval in milliseconds
const isQuiet = Deno.args.includes("--quiet");
const bdmCmd = ["deno", "task", "bdm", `--project=${project}`];
if (isQuiet) bdmCmd.push("--quiet");
// Runs a command in a given directory
const runCommand = (from: string, cmd: string[]) => {
  const command = new Deno.Command(cmd[0], {
    args: cmd.slice(1),
    stdout: "piped", // Directly inherit stdout
    stderr: "piped", // Directly inherit stderr
    cwd: from,
    env: {
      ...Deno.env.toObject(), // Preserve existing environment variables
      DENONOWARN: "experimentalDecorators",
    },
  });
  // Helper function to stream and filter output
  async function streamOutput(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    writer: any,
    filter: (line: string) => boolean,
  ) {
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const text = decoder.decode(value);
      const filteredText = text
        .split("\n")
        .filter(filter)
        .join("\n");
      const decodedValue = decoder.decode(value);
      if (filteredText === decodedValue) {
        const toWrite = filteredText === "\n" ? "" : filteredText;
        writer.writeSync(encoder.encode(toWrite));
      }
    }
  }

  const process = command.spawn();

  const stdoutReader = process.stdout.getReader();
  const stderrReader = process.stderr.getReader();
  streamOutput(stdoutReader, Deno.stdout, () => true), // No filtering for stdout
    streamOutput(stderrReader, Deno.stderr, (line) => {
      const condition1 = !line.includes("experimentalDecorators");
      const condition2 = !line.includes("bdm");
      return condition1 && condition2;
    });

  //.then(({ success }) => {
  //  if (success) {
  //    console.log(`Command succeeded: ${cmd.join(" ")}`);
  //  } else {
  //    console.error(`Command failed: ${cmd.join(" ")}`);
  //  }
  //})
  //.catch((err) => {
  //  console.error(`Failed to run command: ${err.message}`);
  //});

  //process.output()
  return process; // Return the process for management
};

// Retrieves the Git repository root directory
function getGitRoot(): string {
  try {
    const command = new Deno.Command("git", {
      args: ["rev-parse", "--show-toplevel"],
      stdout: "piped",
    });
    const result = command.outputSync();

    if (result.success) {
      return new TextDecoder().decode(result.stdout).trim();
    } else {
      throw new Error(
        "Failed to locate Git root. Ensure you're in a Git repository.",
      );
    }
  } catch (err) {
    //@ts-ignore
    console.error(`Error retrieving Git root: ${err.message}`);
    throw err;
  }
}

// Builds the serve command
function buildServeCommand(): string[] {
  const ENV_FILE =
    "/Users/goose/Documents/New_Programing/OmniSource/.env.local";
  const ENTRY_POINT = "main.ts";
  const base = "deno run --allow-all --unstable";
  const ext = `--env-file=${ENV_FILE} ${ENTRY_POINT}`;
  return `${base} ${ext}`.split(" ").filter(Boolean);
}

// Terminates all currently running processes
const terminateAllProcesses = () => {
  console.log("Terminating all running processes...");
  for (const process of runningProcesses) {
    try {
      process.kill("SIGTERM");
    } catch (error: any) {
      console.error(`Failed to terminate process: ${error.message}`);
    }
  }
  runningProcesses.clear();
};

// Debounced function to handle changes
const handleChange = debounce(async (path: string) => {
  terminateAllProcesses();
  const root = getGitRoot();
  const newProcesses = [
    runCommand(root, bdmCmd),
    runCommand(".", buildServeCommand()),
  ];

  const origin = path === "Startup" ? "Startup" : path.split("OmniSource")[1];
  const formatted = `${origin} `;

  console.clear();
  console.log(`Detected change: ${formatted} \n Restarting processes...`);
  // Add new processes to the running set
  newProcesses.forEach((process) => runningProcesses.add(process));
}, debounceMs);

// Watch for file changes
const runningProcesses: Set<ReturnType<Deno.Command["spawn"]>> = new Set();

handleChange("Startup"); // Initial run
console.log("Watching for changes...");

for await (const event of Deno.watchFs(pathsToWatch)) {
  const rawPath = event.paths[0];
  const isFiltered = filter.some(f => f.test(rawPath));
  if (isFiltered) continue;
  if(rawPath.includes("git")) continue;
  handleChange(rawPath);
}
