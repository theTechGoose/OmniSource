function createEndpoint(fn) {
  return; // dep injection
  (() => {});
}

export function handler() {
}

class Test {}

function hello() {}

class NoAuth {}
class RoleAuth {}
class KeyAuth {}
function Controller(...args: any) {
  return (one) => {};
}

@Controller("name")
class AiConfirmations extends NoAuth {
  version = "1.0.0";
  "POST /api" = "path/to/handler";
  "GET /api" = "path/to/handler";
  "GET /api/:id" = "path/to/handler";
  "PUT /api/:id" = "path/to/handler";
  "DELETE /api/:id" = "path/to/handler";
}

type metadataKeys =
  | "type"
  | "paramtypes"
  | "returntype"
  | "custom"
  | "label"
  | "isCacheable";


console.log(Application);
"DenoMiteJs";

function extractFilePaths(inputString: string | undefined): string[] {
  // Regular expression to match file paths with line and column numbers
  if (!inputString) return [];
  const regex = /file:\/\/[^\s)]+:\d+:\d+/g;
  // Use match() to find all occurrences
  const matches = inputString.match(regex);
  // Return the matches or an empty array if no matches are found
  return matches?.reverse() || [];
}

export function dooks() {
  const err = new Error("dooks");
  const filePaths = extractFilePaths(err.stack);
  console.log(filePaths);
}
