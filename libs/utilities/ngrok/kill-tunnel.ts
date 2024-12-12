import axios from "#axios";

const NGROK_API_URL = "http://127.0.0.1:4040/api/tunnels";

/**
 * Stops an ngrok tunnel by its name.
 * 
 * @param tunnelName - The name of the tunnel to stop.
 * @returns Promise<void>
 */
export async function killNgrokTunnel(tunnelName: string): Promise<void> {
    // Fetch all active tunnels
    const response = await axios.get(NGROK_API_URL);
    const tunnels = response.data.tunnels;

    if (!tunnels || tunnels.length === 0) {
      console.log("No active tunnels found.");
      return;
    }

    // Find the tunnel with the specified name
    const tunnel = tunnels.find((t: any) => t.name === tunnelName);

    if (!tunnel) {
      console.log(`Tunnel with name "${tunnelName}" not found.`);
      return;
    }

    // Kill the tunnel
    await axios.delete(`${NGROK_API_URL}/${tunnelName}`);
}
