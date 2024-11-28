
CURR=$(pwd)
cd $(git rev-parse --show-toplevel) && 
cd ./shared/scripts &&
echo $(pwd)
deno -A ./multi-run/core/_mod.ts --expose='ngrok http --domain=omnisource.ngrok.dev 8765' --cmd="deno run -A $CURR/core/_mod.ts"


# concurrently 'ngrok http --domain=deploy.ngrok.app 8765' 'deno run -A ../local-server/core/_mod.ts /_mod.ts --config=./local-server --env-file=.env.prod --watch'



