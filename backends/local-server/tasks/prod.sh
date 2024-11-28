CURR=$(pwd)
cd $(git rev-parse --show-toplevel) && 
cd ./shared/scripts &&
echo $(pwd)
deno -A ./multi-run/core/_mod.ts --expose='ngrok http --domain=deploy.ngrok.app 8765' --cmd="deno run -A $CURR/core/_mod.ts"
