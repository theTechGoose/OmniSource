

export function help() {
  const text = `
  project: **requied, the name of the project must be part of the workspace
  watch: the directory to watch for changes, relative to the git root
  filter: comma separated list of strings to filter out of the watch
  expose: command to run before starting the watcher **NGROK**
  cmd: comma separated list of commands to run on change
  `



  console.log(text)
  Deno.exit(0)
}



