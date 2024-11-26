concurrently 'ngrok http --domain=deploy.ngrok.app 8765' 'deno run -A ./core/_mod.ts /_mod.ts --config=./local-server --env-file=.env.prod --watch'
