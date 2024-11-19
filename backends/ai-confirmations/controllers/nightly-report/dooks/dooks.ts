
function extractFilePaths(inputString: string | undefined): string[] {
  // Regular expression to match file paths with line and column numbers
  if(!inputString) return []
  const regex = /file:\/\/[^\s)]+:\d+:\d+/g;
  // Use match() to find all occurrences
  const matches = inputString.match(regex);
  // Return the matches or an empty array if no matches are found
  return matches?.reverse() || [];
}

export function dooks() {
  const err = new Error('dooks')
  const filePaths = extractFilePaths(err.stack);
  console.log(filePaths)

}
