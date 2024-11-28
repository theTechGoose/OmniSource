import { runCommand } from "../core/_mod.ts"; // Adjust path to your utility

/**
 * Kill all Deno processes except the current one.
 */
export async function killAllDenoProcessesExceptCurrent(): Promise<void> {
  try {
    const keepPid = Deno.pid; // Get the PID of the current process
    console.log(`Current Deno PID: ${keepPid}`);
    console.log("Fetching all Deno processes...");

    // Use `ps` command to list all processes containing "deno"
    const process = runCommand(".", ["bash", "-c", "ps -e | grep deno"]);
    const { success } = await process.status;
    if (!success) {
      console.error("Failed to list processes. Is `ps` available?");
      return;
    }

    const stdout = await new TextDecoder().decode(await process.output());
    const processes = stdout
      .split("\n")
      .filter((line) => line.trim() !== "") // Remove empty lines
      .map((line) => {
        const parts = line.trim().split(/\s+/);
        return { pid: parseInt(parts[0], 10), command: parts.slice(4).join(" ") };
      });

    if (processes.length === 0) {
      console.log("No Deno processes found.");
      return;
    }

    // Kill all Deno processes except the current one
    for (const proc of processes) {
      if (proc.pid !== keepPid) {
        console.log(`Killing process: PID=${proc.pid}, Command=${proc.command}`);
        const killProcess = runCommand(".", ["kill", "-9", proc.pid.toString()]);
        await killProcess.status;
      } else {
        console.log(`Keeping process: PID=${proc.pid}, Command=${proc.command}`);
      }
    }

    console.log("All other Deno processes have been terminated.");
  } catch (error) {
    console.error("Error occurred:", error.message);
  }
}

// Run the function to kill all Deno processes except the current one
killAllDenoProcessesExceptCurrent();
