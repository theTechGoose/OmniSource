export async function hash(input: string): Promise<string> {
  // Convert input string to Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  // Generate the SHA-256 hash as an ArrayBuffer
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert ArrayBuffer to a hexadecimal string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  return hashHex;
}

