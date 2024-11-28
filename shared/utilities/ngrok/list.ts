import axios from "#axios";

const NGROK_API_URL = "http://127.0.0.1:4040/api/tunnels";

/**
 * Fetches and logs all active ngrok tunnels.
 */
export async function listNgrokTunnels() {
    // Make a GET request to the ngrok API
    const response = await axios.get(NGROK_API_URL);
    const {tunnels} = response.data;

    if (!tunnels || tunnels.length === 0) {
      console.log("No active tunnels found.");
      return [];
    }

    return tunnels
}
