import { debounce } from "@libs/std";
import { sleep } from "@utils";
import json from "../../deno.json" with { type: "json" };

const project =
  Deno.args.find((a) => a.startsWith("--project="))?.split("=")[1] ?? "err";
const allProjects = json.workspace.map((p: string) => p.split("/")[1]).filter(
  Boolean,
);
if (project === "err") throw new Error("No project name provided");
if (!allProjects.includes(project)) {
  throw new Error(`Project ${project} not found`);
}

const pathsToWatch = ["../../"]; // Directories to watch for changes
const registryPattern = /registry.ts/;

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
      FORCE_COLOR: '1', // Ensure this is correctly set
      TERM: 'xterm-256color',
    },
  });
  const process = command.spawn();

  // Function to pipe streams without altering them
  const pipeStream = async (
    reader: ReadableStreamDefaultReader<Uint8Array>,
    writer: typeof Deno.stdout | typeof Deno.stderr,
    filter?: (line: string) => boolean,
  ) => {
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      let text = decoder.decode(value);

      if (filter) {
        // Split into lines for filtering
        const lines = text.split("\n");
        const filteredLines = lines.filter(filter);
        text = filteredLines.join("\n");
      }

      // Write the (possibly filtered) text
      if (text) {
        writer.writeSync(encoder.encode(text));
      }
    }
  };

  // Pipe stdout without filtering
  pipeStream(process.stdout.getReader(), Deno.stdout);

  // Pipe stderr with filtering
  pipeStream(process.stderr.getReader(), Deno.stderr, (line) => {
    const condition1 = !line.includes("experimentalDecorators");
    const condition2 = !line.includes("bdm");
    return condition1 && condition2;
  });

  return process;
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
  const base = "deno run --allow-all --unstable-kv";
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
      const message = error?.message ?? "";
      if (message.includes("Child Process has already terminated")) continue;
      console.error(`Failed to terminate process: ${error.message}`);
    }
  }
  runningProcesses.clear();
};

// Debounced function to handle changes
const handleChange = debounce(async (path: string) => {
  terminateAllProcesses();
  const root = getGitRoot();
  const build = await runCommand(root, bdmCmd);
  await build.status;
  const serve = await runCommand(
    `${root}/backends/${project}`,
    buildServeCommand(),
  );
  runningProcesses.add(build);
  runningProcesses.add(serve);

  const origin = path === "Startup" ? "Startup" : path.split("OmniSource")[1];
  const formatted = `${origin} `;

  console.clear();
  console.log(`Detected change: ${formatted} \nRestarting processes...`);
  // Add new processes to the running set
  //
  //newProcesses.forEach((process) => runningProcesses.add(process));
}, debounceMs);

// Watch for file changes
const runningProcesses: Set<ReturnType<Deno.Command["spawn"]>> = new Set();

handleChange("Startup"); // Initial run
console.log("Watching for changes...");
for await (const event of Deno.watchFs(pathsToWatch)) {
  const rawPath = event.paths[0];
  const test = registryPattern.test(rawPath);
  if (test) continue;
  handleChange(rawPath);
}
