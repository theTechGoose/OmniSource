
# Importing files
current_dir=$PWD
path="$current_dir/scripts/build-dep-map/"
echo $path


source "$path/find-all-deno-json.sh"



# Function to find all `deno.json` and `deno.jsonc` files
 find_deno_packages 


