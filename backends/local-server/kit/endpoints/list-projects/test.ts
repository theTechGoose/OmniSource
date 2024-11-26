import {listProjects} from "./_mod.ts";
import axios from "#axios";



Deno.test('listProjects', async () => {
  const url = 'http://localhost:8765/list'
    const response = await axios.get(url)
    console.log(response.data)
})
