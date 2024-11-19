ENV_FILE="/Users/goose/Documents/New_Programing/OmniSource/.env.local"
ENTRY_POINT="./main.ts"

deno run --allow-all --env-file=$ENV_FILE  --unstable-kv $ENTRY_POINT
