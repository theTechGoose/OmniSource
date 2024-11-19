import "./registry.ts"
//import "https://deno.land/std@0.153.0/dotenv/load.ts";
//import "./controllers/nightly-report/bland-input/endpoint.ts"
//import "@global_models"
import "./controllers/nightly-report/~index.ts";
import { RouteTracker } from "@shared/framework/core";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
//import "./registry.ts"


await new RouteTracker(Router, Application).start('ai-conf');
