import { TextLineStream } from "#std/streams/text_line_stream";

export const runCommand = (
  from: string,
  cmd: string[],
  ...filters: string[]
): Deno.ChildProcess => {
  const base = cmd[0];
  const args = cmd.slice(1);

  const command = new Deno.Command(base, {
    args,
    stdout: "piped",
    stderr: "piped",
    cwd: from,
    env: {
      DENONOWARN: "experimentalDecorators",
      FORCE_COLOR: "1",
      TERM: "xterm-256color",
    },
  });

  const process = command.spawn();

  const pipeStream = async (
    stream: ReadableStream<Uint8Array>,
    filter?: (line: string) => boolean
  ) => {
    const textStream = stream
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new TextLineStream());

    try {
      for await (const line of textStream) {
        if (!filter || filter(line)) {
          await Deno.stdout.write(new TextEncoder().encode(line + "\n"));
        }
      }
    } catch (error) {
      console.error("Error in stream processing:", error);
    }
  };

  if (process.stdout) {
    const reader = process.stdout.getReader();
    const stream = new ReadableStream({
      start(controller) {
        (async () => {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              controller.enqueue(value);
            }
          } finally {
            reader.releaseLock();
            controller.close();
          }
        })();
      },
    });
    pipeStream(stream);
  }

  if (process.stderr) {
    const reader = process.stderr.getReader();
    const stream = new ReadableStream({
      start(controller) {
        (async () => {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              controller.enqueue(value);
            }
          } finally {
            reader.releaseLock();
            controller.close();
          }
        })();
      },
    });
    pipeStream(stream, (line) => filters.every((filter) => !line.includes(filter)));
  }

  return process;
};
