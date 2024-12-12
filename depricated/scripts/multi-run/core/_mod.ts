import { debounce } from "#std";
import { getArg, getGitRoot, runCommand, ProcessManager } from "@shared/utils";
import { help } from "../kit/help.ts";
import { getRelativeWatchPath } from "../kit/get-relative-watch-path.ts";
import { DEBOUNCE_MS } from "../settings.ts";

const isHelp = getArg("help");
if (isHelp) help();

const watchPath = getArg("watch") ?? "";
const filter = getArg("filter").split(",") as string[];
const expose = getArg("expose").split(" ");
const cmds = getArg("cmd").split(",") as string[];
if (expose) runCommand(".", expose);
const root = getGitRoot();
const pm = new ProcessManager(root);
const fullWatchPath = getRelativeWatchPath(Deno.cwd(), watchPath, root);

const debounced = debounce((event) =>
  (() => {
    const rawPath = event.paths[0];
    const filterHits = filter.some((f) => rawPath.includes(f));
    const isFiltered = filter[0] && filterHits;
    if (isFiltered) return;
    const [_, formatted] = rawPath.split("OmniSource");
    pm.handleChange(cmds, `Detected change: ${formatted}\nRestarting processes...`);
  })(), DEBOUNCE_MS);

console.log(`Watching for changes in: ${fullWatchPath}`);
    pm.handleChange(cmds, "Starting processes...");
for await (const event of Deno.watchFs(fullWatchPath)) {
  debounced(event);
}
