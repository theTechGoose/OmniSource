export const runCommand = (
  from: string,
  cmd: string[],
  ...filters: string[]
) => {

  const command = new Deno.Command(cmd[0], {
    args: cmd.slice(1),
    stdout: "piped", // Directly inherit stdout
    stderr: "piped", // Directly inherit stderr
    cwd: from,
    env: {
      ...Deno.env.toObject(), // Preserve existing environment variables
      DENONOWARN: "experimentalDecorators",
      FORCE_COLOR: "1", // Ensure this is correctly set
      TERM: "xterm-256color",
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
    return filters.every((filter) => !line.includes(filter));
  });

  return process;
};
